import { Clip, ShallowClip } from './clip'
import { getFuncArgNames, extractProps } from './utils'
import { ComponentNamingError, ComponentDuplicatedError } from './error'
import { createProxy } from './reactive'

let currentHandle: UpdatableElement

export const resolveCurrentHandle = () => currentHandle

export const setCurrentHandle = (clip: UpdatableElement) =>
  (currentHandle = clip)

// const mountQueue = new Set<UpdatableElement>()
const updateQueue = new Set<UpdatableElement>()

let dirty = false

function requestUpdate() {
  if (dirty) {
    return
  }
  dirty = true
  requestAnimationFrame(() => {
    updateQueue.forEach((instance) => {
      instance.dispatchUpdate()
    })
    dirty = false
    updateQueue.clear()
  })
}

export type ComponentBuilder = (...props: any[]) => ShallowClip

export abstract class UpdatableElement extends HTMLElement {
  $props: unknown[] = []
  $state?: unknown
  $root: ShadowRoot | UpdatableElement
  $builder: ComponentBuilder

  $clip?: Clip

  private propNames: string[]

  constructor(builder: ComponentBuilder, shadow: boolean, propNames: string[]) {
    super()
    this.$builder = builder
    this.$root = shadow ? this.attachShadow({ mode: 'open' }) : this
    this.propNames = propNames
    if (this.propNames.length) {
      const p = new Array(this.propNames.length).fill(undefined)
      const staticProps = extractProps(this.attributes)
      for (const key in staticProps) {
        const index = this.propNames.indexOf(key)
        if (index > 0) {
          p[index] = staticProps[key]
        }
      }
      this.$props = createProxy(p, () => this.enUpdateQueue())
    }
    this.$root.append(
      this.$builder.apply(this, this.$props).createInstanceFromCache().dof //---
    )
    console.log('element constructed')
  }

  enUpdateQueue() {
    updateQueue.add(this)
    requestUpdate()
  }

  dispatchMount() {}

  dispatchUpdate() {}

  mergeProps(name: string, val: unknown) {
    const index = this.propNames?.indexOf(name)
    if (index && index > 0) {
      this.$props[index] = val
    }
  }

  requestUpdate() {}

  requestMount() {}

  connectedCallback() {
    console.log(`${this.nodeName} connected`)
  }

  disconnectedCallback() {
    console.log(`${this.nodeName} disconnected`)
  }
}

const componentPool = new Set<string>()

export function component(
  name: string,
  builder: ComponentBuilder,
  shadow: boolean = true,
  option?: ElementDefinitionOptions
) {
  if (!verifyComponentName(name)) {
    throw ComponentNamingError(name)
  }

  if (componentPool.has(name)) {
    throw ComponentDuplicatedError(name)
  }

  const propNames = getFuncArgNames(builder).map((name) => name.toLowerCase())

  const clazz = class extends UpdatableElement {
    constructor() {
      super(builder, shadow, propNames)
    }
  }

  customElements.define(name, clazz, option)
  componentPool.add(name)
}

function verifyComponentName(name: string) {
  const arr = name.split('-')
  return arr[arr.length - 1] && arr.length >= 2 && name.toLowerCase() === name
}
