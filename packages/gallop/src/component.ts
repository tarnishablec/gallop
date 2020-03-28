import { Clip, ShallowClip } from './clip'
import { getFuncArgNames } from './utils'
import { ComponentNamingError, ComponentDuplicatedError } from './error'

let currentHandle: UpdatableElement

export const resolveCurrentHandle = () => currentHandle

export const setCurrentHandle = (clip: UpdatableElement) =>
  (currentHandle = clip)

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

  protected propNames?: string[]

  constructor(builder: ComponentBuilder, shadow: boolean) {
    super()
    this.$builder = builder
    this.$root = shadow ? this.attachShadow({ mode: 'open' }) : this
    console.log('element constructed')
  }

  enUpdateQueue() {
    updateQueue.add(this)
    requestUpdate()
  }

  dispatchUpdate() {}

  mergeProps() {}

  requestUpdate() {}

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
  shadow: boolean = true
) {
  if (!verifyComponentName(name)) {
    throw ComponentNamingError
  }

  if (componentPool.has(name)) {
    throw ComponentDuplicatedError
  }

  const propNames = getFuncArgNames(builder)

  const clazz = class extends UpdatableElement {
    constructor() {
      super(builder, shadow)
      this.propNames = propNames
    }
  }

  customElements.define(name, clazz)
  componentPool.add(name)
}

function verifyComponentName(name: string) {
  const arr = name.split('-')
  return arr[arr.length - 1] && arr.length >= 2 && name.toLowerCase() === name
}
