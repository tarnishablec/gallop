import { Clip, ShallowClip, createInstance, getVals } from './clip'
import { getFuncArgNames, extractProps } from './utils'
import { ComponentNamingError, ComponentDuplicatedError } from './error'
import { createProxy } from './reactive'

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
      setCurrentHandle(instance)
      instance.dispatchUpdate()
      updateQueue.delete(instance)
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
  $alive: boolean = false

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
        if (index >= 0) {
          p[index] = staticProps[key]
        }
      }
      this.$props = createProxy(p, () => this.enUpdateQueue())
    }

    this.enUpdateQueue()
    console.log(`${this.nodeName} constructed`)
  }

  enUpdateQueue() {
    updateQueue.add(this)
    requestUpdate()
  }

  dispatchUpdate() {
    const shaClip = this.$builder.apply(this, this.$props)
    if (!this.$clip) {
      this.mount(shaClip)
    } else {
      this.$clip!.tryUpdate(shaClip.do(getVals))
    }
    console.log(`${this.nodeName} updated`)
  }

  mount(shaClip: ShallowClip) {
    const clip = shaClip.do(createInstance)
    this.$clip = clip
    this.$clip!.tryUpdate(shaClip.do(getVals))
    this.$root.append(this.$clip.dof)

    this.$clip.contexts?.forEach((context) => context.watch(this))
    this.$alive = true
    console.log(`${this.tagName} mounted`)
  }

  mergeProps(name: string, val: unknown) {
    const index = this.propNames?.indexOf(name)
    if (index >= 0) {
      this.$props[index] = val
    }
  }

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
