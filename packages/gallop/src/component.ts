import { Clip, ShallowClip, createInstance, getVals, getContexts } from './clip'
import { getFuncArgNames, extractProps } from './utils'
import { ComponentNamingError, ComponentDuplicatedError } from './error'
import { createProxy } from './reactive'
import { Effect, resolveEffects } from './hooks'
import { Context } from './context'
import { ParamsOf } from './do'
import { html } from '.'

let currentHandle: UpdatableElement

export const resolveCurrentHandle = () => currentHandle

export const setCurrentHandle = (element: UpdatableElement) =>
  (currentHandle = element)

const updateQueue = new Set<UpdatableElement>()

let dirty = false

export function requestUpdate() {
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

export type Component = (...props: any[]) => ShallowClip
export type EffectInfo = { e: Effect; index: number }

export abstract class UpdatableElement extends HTMLElement {
  $props: unknown[] = []
  $state?: [unknown, unknown]
  $root: ShadowRoot | UpdatableElement
  $builder: Component
  $alive: boolean = false

  $updateEffects?: EffectInfo[]
  $mountedEffects?: EffectInfo[]
  $disconnectedEffects?: (() => void)[]

  $brobs: Map<string, unknown> = new Map()

  $effectsCount: number = 0

  $dependsCache?: unknown[][]

  $clip?: Clip

  $contexts?: Set<Context<Object>>

  protected propNames: string[] = []

  constructor(builder: Component, shadow: boolean, propNames: string[]) {
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
        } else {
          this.$brobs.set(key, staticProps[key])
        }
      }
      this.$props = createProxy(p, () => this.enUpdateQueue())
    }
  }

  enUpdateQueue() {
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
    resolveEffects(this, this.$updateEffects)
  }

  mount(shaClip: ShallowClip) {
    const clip = shaClip.do(createInstance)
    this.$clip = clip
    this.$root.append(this.$clip.dof)
    shaClip.do(getContexts)?.forEach((context) => {
      context.watch(this)
      ;(this.$contexts ?? (this.$contexts = new Set())).add(context)
    })
    // console.log(`${this.tagName} mounted`)
    resolveEffects(this, this.$mountedEffects)
  }

  mergeProp(name: string, val: unknown) {
    const index = this.propNames?.indexOf(name)
    if (index >= 0) {
      this.$props[index] = val
    } else {
      this.$brobs.set(name, val)
    }
  }

  mergeProps(props: unknown[]) {
    props.forEach((prop, index) => {
      this.$props[index] = prop
    })
  }

  connectedCallback() {
    this.$alive = true
    // console.log(`${this.nodeName} connected`)
  }

  disconnectedCallback() {
    this.$contexts?.forEach((context) => {
      context.unWatch(this)
    })
    this.$contexts = new Set()
    // console.log(`${this.nodeName} disconnected`)
    this.$disconnectedEffects?.filter(Boolean).forEach((effect) => {
      effect.apply(this)
    })
    this.$alive = false
  }

  resetEffects() {
    this.$updateEffects = []
    this.$mountedEffects = []
    this.$effectsCount = 0
  }
}

const componentPool = new Set<string>()

export function component<F extends Component>(
  name: string,
  builder: F,
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

  return (...args: ParamsOf<F>) => {
    console.log(name)
    const tag = `<${name}></${name}>`
    return html` ${tag} `
  }
}

export function verifyComponentName(name: string) {
  const arr = name.split('-')
  return arr[arr.length - 1] && arr.length >= 2 && name.toLowerCase() === name
}
