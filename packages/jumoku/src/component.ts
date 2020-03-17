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
    updateQueue.forEach(c => {
      let instance = c.elementInstance!
      setCurrentHandle(instance)
      c.update(instance.builder.apply(instance, instance.$props ?? []).vals)
    })
    updateQueue.clear()
    dirty = false
  })
}

let currentHandleElement: UpdatableElement

export const resolveCurrentHandle = () => currentHandleElement

export const setCurrentHandle = (el: UpdatableElement) =>
  (currentHandleElement = el)

type Component = (...props: any[]) => ShallowClip

export const componentPool = new Set<string>()

export abstract class UpdatableElement extends HTMLElement {
  builder: Component
  propNames: string[]
  $props?: unknown[]
  $state?: unknown
  clip!: Clip

  constructor(builder: Component, propNames: string[]) {
    super()
    this.builder = builder
    this.propNames = propNames
    if (propNames.length) {
      let p = new Array(propNames.length).fill(undefined)
      const attr = this.attributes
      let staticProps = extractProp(attr)
      for (const key in staticProps) {
        let index = propNames.indexOf(key)
        if (index >= 0) {
          p[index] = staticProps[key]
        }
      }
      this.$props = createProxy(p, () => this.enupdateQueue())
    }
    setCurrentHandle(this)
    let shallow = this.builder.apply(this, this.$props ?? [])
    const clip = shallow.createInstance()
    this.clip = clip
    this.clip.elementInstance = this
    this.clip.init()
    this.attachShadow({ mode: 'open' }).appendChild(this.clip.dof)
  }

  enupdateQueue() {
    updateQueue.add(this.clip)
    requestUpdate()
  }

  connectedCallback() {
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

  dispatchUpdate() {}
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
