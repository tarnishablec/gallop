import { ShallowClip, Clip } from './clip'
import { getPropsFromFunction } from './utils'
import { ComponentNamingError, ComponentExistError } from './error'
import { createProxy } from './reactive'

// let currentElement = null

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
      c.update(instance.builder(instance.$props).vals)
    })
    dirty = false
  })
}

type Compoent<P> = (props?: P) => ShallowClip

export const componentPool = new Set<string>()

export abstract class UpdatableElement<P extends object> extends HTMLElement {
  $props: P | undefined
  $state: unknown
  builder: Compoent<P>
  clip!: Clip

  hooksEnable: boolean = false

  constructor(initProp: P, builder: Compoent<P>) {
    super()
    this.builder = builder
    this.$props = createProxy(
      initProp,
      () => {
        // console.log(`${this.tagName} updated`)
        this.enupdateQueue()
      },
      undefined,
      false
    )
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

  const Clazz = class extends UpdatableElement<P> {
    static initShaClip: ShallowClip = builder(defaultProp)
    updatable: boolean = false

    constructor() {
      super(defaultProp ?? ({} as P), builder)
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
