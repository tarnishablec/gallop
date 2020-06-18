import { Clip, HTMLClip, createClip, getVals, getShaHtml } from './clip'
import { extractProps, keysOf } from './utils'
import { createProxy, resetDirtyMap } from './reactive'
import { Effect, resolveEffects } from './hooks'
import { Context } from './context'
import { removeNodes } from './dom'
import { Memo } from './memo'
import { VirtualElement } from './virtual'

let currentHandle: ReactiveElement

export const resolveCurrentHandle = () => currentHandle

export const setCurrentHandle = (element: ReactiveElement) =>
  (currentHandle = element)

const updateQueue = new Set<ReactiveElement>()

let dirty = false

export function enUpdateQueue() {
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
    resetDirtyMap()
    dirty = false
    updateQueue.clear()
  })
}

export type Component = (...args: any) => HTMLClip
export type Complex = (...args: any) => VirtualElement

export type EffectInfo = { e: Effect; index: number }

export abstract class ReactiveElement extends HTMLElement {
  protected $props = createProxy({}, { onSet: () => this.requestUpdate() })
  $state?: unknown
  $root: ShadowRoot | ReactiveElement
  $builder: Component
  $alive: boolean = false

  $updateEffects?: EffectInfo[]
  $mountedEffects?: EffectInfo[]
  $disconnectedEffects?: (() => void)[]

  $brobs: any = createProxy({}, { onSet: () => this.requestUpdate() })
  $cache?: unknown

  $effectsCount: number = 0
  $memosCount: number = 0

  $effectDepends?: unknown[][]
  $memoDepends?: unknown[][]

  $clip?: Clip

  $unstable: boolean

  $shaCache?: string

  $contexts?: Set<Context<Object>>
  $memos?: Map<number, Memo<() => any>>

  $on = this.addEventListener
  $emit = this.dispatchEvent

  constructor(builder: Component, shadow: boolean, unstable: boolean) {
    super()
    this.$unstable = unstable
    this.$builder = builder
    this.$root = shadow ? this.attachShadow({ mode: 'open' }) : this
    this.mergeProps(extractProps(this.attributes))
    // console.log(`${this.nodeName} constructed`)
  }

  requestUpdate() {
    updateQueue.add(this)
    enUpdateQueue()
  }

  dispatchUpdate() {
    const shaClip = this.$builder.call(this, this.$props)
    if (!this.$clip) {
      this.mount(shaClip)
    } else if (this.$unstable) {
      if (this.$shaCache !== shaClip.do(getShaHtml)) {
        removeNodes(this.$root)
        this.initClip(shaClip)
      }
    }
    this.$clip!.tryUpdate(shaClip.do(getVals))
    // console.log(`${this.nodeName} updated`)
    resolveEffects(this, this.$updateEffects)
  }

  initClip(shaClip: HTMLClip) {
    const clip = shaClip.do(createClip)
    if (this.$unstable) {
      this.$shaCache = shaClip.do(getShaHtml)
    }
    this.$clip = clip
    this.$root.append(this.$clip!.dof)
  }

  mount(shaClip: HTMLClip) {
    this.initClip(shaClip)
    // console.log(`${this.tagName} mounted`)
    resolveEffects(this, this.$mountedEffects)
  }

  mergeProp(name: string, val: unknown) {
    Reflect.set(this.$props, name, val)
    return this
  }

  mergeProps(props: object) {
    keysOf(props).forEach((k) => {
      this.mergeProp(k, props[k])
    })
    return this
  }

  connectedCallback() {
    this.requestUpdate()
    // console.log(`${this.nodeName} connected`)
  }

  disconnectedCallback() {
    // console.log(`${this.nodeName} disconnected`)
    this.$disconnectedEffects?.filter(Boolean).forEach((effect) => effect())
    this.$clip?.destroy()

    if (!this.$alive) {
      this.$contexts?.forEach((context) => context.unWatch(this))
      this.$memos?.forEach((m) => m.watchList.clear())
      this.$contexts = undefined
      this.$memos?.clear()
      this.$memos = undefined
    }
  }

  resetEffects() {
    this.$updateEffects = []
    this.$mountedEffects = []
    this.$effectsCount = 0
    this.$memosCount = 0
  }
}

export const componentPool = new Map<string, number>()

export function component<F extends Component>(
  name: string,
  builder: F,
  {
    unstable = false,
    shadow = true,
    definitionOptions
  }: {
    unstable?: boolean
    shadow?: boolean
    definitionOptions?: ElementDefinitionOptions
  } = {}
) {
  const clazz = class extends ReactiveElement {
    constructor() {
      super(builder, shadow, unstable)
    }
  }

  customElements.define(name, clazz, definitionOptions)
  componentPool.set(name, 1)

  return (...args: Parameters<F>) => new VirtualElement(name, args[0])
}
