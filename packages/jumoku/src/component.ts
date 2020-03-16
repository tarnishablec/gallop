import { ShallowClip, Clip } from './clip'
import { getPropsFromFunction, OBJ } from './utils'
import { ComponentNamingError, ComponentExistError } from './error'
import { createProxy } from './reactive'
import { isMarker } from './is'

const updateQueue = new Set<Clip>()

let dirty = false

const requestUpdate = () => {
  if (dirty === true) {
    return
  }
  dirty = true

  requestAnimationFrame(() => {
    updateQueue.forEach(c => {
      let instance = c.elementInstance!
      setCurrentHandle(instance)
      c.update(instance.builder(instance.$props).vals)
    })
    updateQueue.clear()
    dirty = false
  })
}

let currentHandleElement: UpdatableElement<any, any>

export const resolveCurrentHandle = () => currentHandleElement

export const setCurrentHandle = (el: UpdatableElement<any, any>) =>
  (currentHandleElement = el)

type Component<P> = (props?: P) => ShallowClip

export const componentPool = new Set<string>()

export abstract class UpdatableElement<
  P extends OBJ,
  S extends OBJ
> extends HTMLElement {
  $props?: P
  $state?: S
  builder: Component<P>
  clip!: Clip

  hooksEnable: boolean = false

  constructor(builder: Component<P>, initProp?: P) {
    super()
    this.builder = builder
    this.$props = initProp
      ? createProxy(
          initProp,
          () => {
            this.enupdateQueue()
          },
          undefined,
          false
        )
      : undefined
  }

  initializeState(initState: S) {
    this.$state = initState
  }

  enupdateQueue() {
    updateQueue.add(this.clip)
    requestUpdate()
  }

  connectedCallback() {
    this.hooksEnable = true

    this.clip.contexts.forEach(c => {
      c.watch(this.clip)
    })
  }

  disconnectedCallback() {
    this.clip.contexts.forEach(c => {
      c.unwatch(this.clip)
    })
  }

  adoptedCallback() {}
}

export function component<P extends OBJ>(name: string, builder: Component<P>) {
  if (!checkComponentName(name)) {
    throw ComponentNamingError
  }
  if (componentPool.has(name)) {
    throw ComponentExistError
  }

  let { defaultProp } = getPropsFromFunction(builder)

  const Clazz = class extends UpdatableElement<P, OBJ> {
    // static initShaClip: ShallowClip
    updatable: boolean = false
    static initialProp?: P

    constructor() {
      super(builder, defaultProp)
      setCurrentHandle(this)
      // Clazz.initShaClip = builder(defaultProp)
      this.clip = builder(defaultProp).createInstance()
      this.clip.init()
      this.clip.elementInstance = this
      Array.from(this.attributes)
        .filter(a => /^:\s*/.test(a.name) && !isMarker(a.value))
        .forEach(attr => {
          this.$props![
            attr.name.slice(1) as keyof P
          ] = attr.value as NonNullable<P>[keyof P]
        })
      this.attachShadow({ mode: 'open' }).appendChild(this.clip.dof)
    }
  }
  customElements.define(name, Clazz)
  componentPool.add(name)
}

const checkComponentName = (name: string) => {
  const arr = name.split('-')
  return arr[arr.length - 1] && arr.length >= 2 && name.toLowerCase() === name
}

export const convertClassName = (name: string) =>
  name
    .split('-')
    .map(n => n.replace(/^[a-z]/, i => i.toUpperCase()))
    .join('')
