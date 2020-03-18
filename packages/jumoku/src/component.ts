import { ShallowClip, Clip } from './clip'
import { OBJ, getFuncArgNames, extractProp } from './utils'
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
    // debugger
    updateQueue.forEach(c => {
      let instance = c.elementInstance!
      setCurrentHandle(instance)
      instance.dispatchUpdate()
    })
    updateQueue.clear()
    dirty = false
  })
}

let currentHandleElement: UpdatableElement

export const resolveCurrentHandle = () => currentHandleElement

export const setCurrentHandle = (el: UpdatableElement) =>
  (currentHandleElement = el)

type Component = (this: UpdatableElement, ...props: any[]) => ShallowClip

export const componentPool = new Set<string>()

export abstract class UpdatableElement extends HTMLElement {
  builder: Component
  propNames: string[]
  $props?: unknown[]
  $state?: unknown
  $refs?: Element[]
  $alive: boolean = false
  clip!: Clip

  constructor(builder: Component, propNames: string[]) {
    super()
    this.builder = builder
    this.propNames = propNames.map(n => n.toLowerCase())
    if (propNames.length) {
      let p = new Array(this.propNames.length).fill(undefined)
      const attr = this.attributes
      let staticProps = extractProp(attr) //lower
      for (const key in staticProps) {
        let index = this.propNames.indexOf(key)
        if (index >= 0) {
          p[index] = staticProps[key]
        }
      }
      this.$props = createProxy(p, () => this.enupdateQueue())
    }
    setCurrentHandle(this)
    let shallow = this.builder.apply(this, this.$props ?? [])
    const clip = shallow._createInstance()
    this.clip = clip
    this.clip.elementInstance = this
    this.clip.init()
    this.attachShadow({ mode: 'open' }).appendChild(this.clip.dof)
  }

  dispatchUpdate() {
    this.clip.update(this.builder.apply(this, this.$props ?? [])._getVals())
  }

  enupdateQueue() {
    updateQueue.add(this.clip)
    requestUpdate()
  }

  connectedCallback() {
    this.$alive = true
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

  mergeProps(name: string, val: unknown) {
    let index = this.propNames.indexOf(name)
    if (index >= 0) {
      this.$props ? (this.$props[index] = val) : null
    }
  }
}

export function component<P extends OBJ>(name: string, builder: Component) {
  if (!checkComponentName(name)) {
    throw ComponentNamingError
  }
  if (componentPool.has(name)) {
    throw ComponentExistError
  }

  const propNames = getFuncArgNames(builder)

  const Clazz = class extends UpdatableElement {
    static propNames: string[]
    constructor() {
      super(builder, propNames)
    }
  }
  customElements.define(name, Clazz)
  componentPool.add(name)
}

const checkComponentName = (name: string) => {
  const arr = name.split('-')
  return arr[arr.length - 1] && arr.length >= 2 && name.toLowerCase() === name
}
