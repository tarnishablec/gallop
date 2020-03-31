import { Clip, ShallowClip, createInstance, getVals } from './clip'
import { getFuncArgNames, extractProps } from './utils'
import { ComponentNamingError, ComponentDuplicatedError } from './error'
import { createProxy } from './reactive'
import { Effect, resolveEffect } from './hooks'

let currentHandle: UpdatableElement

export const resolveCurrentHandle = () => currentHandle

export const setCurrentHandle = (element: UpdatableElement) =>
  (currentHandle = element)

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
      instance.resetEffects()
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

  $updateEffects?: Effect[]
  $mountedEffects?: Effect[]
  $disconnectedEffects?: (() => void)[]

  $effectsCount: number = 0

  $dependsCache?: unknown[][]

  $clip?: Clip

  protected propNames: string[] = []

  constructor(builder: ComponentBuilder, shadow: boolean, propNames: string[]) {
    super()
    this.$builder = builder
    this.$root = shadow ? this.attachShadow({ mode: 'open' }) : this
    this.initProps(propNames)
    this.enUpdateQueue()
    // console.log(`${this.nodeName} constructed`)
  }

  initProps(propNames: string[]) {
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
  }

  enUpdateQueue() {
    if (updateQueue.has(this)) {
      updateQueue.delete(this)
    }
    updateQueue.add(this)
    requestUpdate()
  }

  dispatchUpdate() {
    const shaClip = this.$builder.apply(this, this.$props)
    if (!this.$clip) {
      this.mount(shaClip)
    }
    this.$clip!.tryUpdate(shaClip.do(getVals))
    // console.log(`${this.nodeName} updated`)
    this.$updateEffects?.forEach((effect) => {
      resolveEffect(this, effect)
    })
  }

  mount(shaClip: ShallowClip) {
    const clip = shaClip.do(createInstance)
    this.$clip = clip
    this.$root.append(this.$clip.dof)
    this.$clip.contexts?.forEach((context) => context.watch(this))
    // console.log(`${this.tagName} mounted`)
    this.$mountedEffects?.forEach((effect) => {
      resolveEffect(this, effect)
    })
  }

  mergeProps(name: string, val: unknown) {
    const index = this.propNames?.indexOf(name)
    if (index >= 0) {
      this.$props[index] = val
    }
  }

  connectedCallback() {
    this.$alive = true
    // console.log(`${this.nodeName} connected`)
  }

  disconnectedCallback() {
    this.$clip?.contexts?.forEach((context) => context.unWatch(this))
    // console.log(`${this.nodeName} disconnected`)
    this.$disconnectedEffects?.forEach((effect) => {
      effect.apply(this)
    })
    this.$alive = false
  }

  resetEffects() {
    this.$updateEffects = []
    this.$mountedEffects = []
    this.$disconnectedEffects = []
    this.$effectsCount = 0
  }
}

const componentPool = new Set<string>()

export function component(
  name: string,
  builder: ComponentBuilder,
  propNameList?: string[],
  shadow: boolean = true,
  option?: ElementDefinitionOptions
) {
  if (!verifyComponentName(name)) {
    throw ComponentNamingError(name)
  }

  if (componentPool.has(name)) {
    throw ComponentDuplicatedError(name)
  }

  const propNames =
    propNameList ?? getFuncArgNames(builder).map((name) => name.toLowerCase())

  const clazz = class extends UpdatableElement {
    constructor() {
      super(builder, shadow, propNames)
    }
  }

  customElements.define(name, clazz, option)
  componentPool.add(name)
}

export function verifyComponentName(name: string) {
  const arr = name.split('-')
  return arr[arr.length - 1] && arr.length >= 2 && name.toLowerCase() === name
}
