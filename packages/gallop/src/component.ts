import { Clip, ShallowClip } from './clip'
import { getFuncArgNames } from './utils'
import { ComponentNamingError, ComponentDuplicatedError } from './error'

let currentHandle: Clip

export const resolveCurrentHandle = () => currentHandle

export const setCurrentHandle = (clip: Clip) => (currentHandle = clip)

const updateQueue = new Set<Clip>()

let dirty = false

function requestUpdate() {
  if (dirty) {
    return
  }
  dirty = true
  requestAnimationFrame(() => {})
}

export type Component = (...props: any[]) => ShallowClip

export class UpdatableElement extends HTMLElement {
  $props?: unknown
  $state?: unknown
  $clip?: Clip
  $builder: Component

  constructor(builder: Component) {
    super()
    this.$builder = builder
  }

  enUpdateQueue() {}

  dispatchUpdate() {}

  connectedCallback() {}

  disconnectedCallback() {}
}

const componentPool = new Set<string>()

export function component(name: string, builder: Component) {
  if (verifyComponentName(name)) {
    throw ComponentNamingError
  }

  if (componentPool.has(name)) {
    throw ComponentDuplicatedError
  }

  const propNames = getFuncArgNames(builder)

  const Clazz = class extends UpdatableElement {
    constructor() {
      super(builder)
    }
  }

  customElements.define(name, Clazz)
  componentPool.add(name)
}

function verifyComponentName(name: string) {
  const arr = name.split('-')
  return arr[arr.length - 1] && arr.length >= 2 && name.toLowerCase() === name
}
