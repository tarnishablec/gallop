import { ShallowClip, Clip } from './clip'
import { getPropsFromFunction, OBJ } from './utils'
import { ComponentNamingError, ComponentExistError } from './error'
import { createProxy } from './reactive'

const updateQueue = new Set<Clip>()

let dirty = false

const requestUpdate = () => {
  if (dirty === true) {
    return
  }
  dirty = true

  requestAnimationFrame(() => {
    // console.log(updateQueue)
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

type Compoent<P> = (props?: P) => ShallowClip

export const componentPool = new Set<string>()

export abstract class UpdatableElement<
  P extends object,
  S extends object
> extends HTMLElement {
  $props?: P
  $state?: S
  builder: Compoent<P>
  clip!: Clip

  hooksEnable: boolean = false

  constructor(builder: Compoent<P>, initProp?: P) {
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

export function component<P extends object>(
  name: string,
  builder: Compoent<P>
) {
  if (!checkComponentName(name)) {
    throw ComponentNamingError
  }
  if (componentPool.has(name)) {
    throw ComponentExistError
  }

  let { defaultProp } = getPropsFromFunction(builder)
  const Clazz = class extends UpdatableElement<P, OBJ> {
    static initShaClip: ShallowClip
    updatable: boolean = false

    constructor() {
      super(builder, defaultProp)
      setCurrentHandle(this)
      Clazz.initShaClip = builder(defaultProp)
      this.clip = Clazz.initShaClip.createInstance()
      this.clip.init()
      this.clip.elementInstance = this
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
