import { Clip, HTMLClip, createClip, getVals, getShaHtml } from './clip'
import { getFuncArgNames, extractProps } from './utils'
import { createProxy, resetDirtyMap } from './reactive'
import { Effect, resolveEffects } from './hooks'
import { Context } from './context'
import { DoAble } from './do'
import { removeNodes } from './dom'
import { Memo } from './memo'

let currentHandle: ReactiveElement

export const resolveCurrentHandle = () => currentHandle

export const setCurrentHandle = (element: ReactiveElement) =>
  (currentHandle = element)

const updateQueue = new Set<ReactiveElement>()

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
    resetDirtyMap()
    dirty = false
    updateQueue.clear()
  })
}

export type Component = (...props: any[]) => HTMLClip
// export type AsyncComponent = (...props: any[]) => Promise<HTMLClip>
export type Complex = (...props: any[]) => VirtualElement
export type EffectInfo = { e: Effect; index: number }

export abstract class ReactiveElement extends HTMLElement {
  $props: unknown[] = []
  $state?: [unknown]
  $root: ShadowRoot | ReactiveElement
  $builder: Component
  $alive: boolean = false

  $updateEffects?: EffectInfo[]
  $mountedEffects?: EffectInfo[]
  $disconnectedEffects?: (() => void)[]

  $brobs: any = createProxy({}, () => this.enUpdateQueue())
  $cache?: [unknown]

  $effectsCount: number = 0
  $memosCount: number = 0

  $effectDepends?: unknown[][]
  $memoDepends?: unknown[][]

  $clip?: Clip

  $unstable: boolean

  $shaCache?: string

  $contexts?: Set<Context<Object>>
  $memos?: Map<number, Memo<() => any>>

  protected propNames: string[] = []

  constructor(
    builder: Component,
    shadow: boolean,
    propNames: string[],
    unstable: boolean
  ) {
    super()
    this.$unstable = unstable
    this.$builder = builder
    this.$root = shadow ? this.attachShadow({ mode: 'open' }) : this
    this.initProps(propNames)
    this.enUpdateQueue()
    // console.log(`${this.nodeName} constructed`)
  }

  initProps(propNames: string[]) {
    this.propNames = propNames
    const p = new Array(this.propNames.length).fill(undefined)
    const staticProps = extractProps(this.attributes)
    for (const key in staticProps) {
      const index = this.propNames.indexOf(key)
      if (index >= 0) {
        p[index] = staticProps[key]
      } else {
        Reflect.set(this.$brobs, key, staticProps[key])
      }
    }
    propNames.length
      ? (this.$props = createProxy(p, () => this.enUpdateQueue()))
      : undefined
  }

  enUpdateQueue() {
    updateQueue.add(this)
    requestUpdate()
  }

  dispatchUpdate() {
    const shaClip = this.$builder.apply(this, this.$props)
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
    const index = this.propNames?.indexOf(name)
    if (index >= 0) {
      this.$props[index] = val
    } else {
      Reflect.set(this.$brobs, name, val)
    }
  }

  mergeProps(props: unknown[]) {
    props.forEach((prop, index) => {
      this.$props[index] = prop
    })
    return this
  }

  connectedCallback() {
    this.$alive = true
    // console.log(`${this.nodeName} connected`)
  }

  disconnectedCallback() {
    this.$disconnectedEffects?.filter(Boolean).forEach((effect) => effect())

    this.$contexts?.forEach((context) => context.unWatch(this))
    this.$memos?.forEach((m) => m.watchList.clear())
    this.$contexts = undefined
    this.$memos?.clear()
    this.$memos = undefined
    this.$alive = false
    // console.log(`${this.nodeName} disconnected`)
  }

  resetEffects() {
    this.$updateEffects = []
    this.$mountedEffects = []
    this.$effectsCount = 0
    this.$memosCount = 0
  }
}

export const componentPool = new Map<string, string[]>()

export function component<F extends Component>(
  name: string,
  builder: F,
  option: {
    propList?: string[]
    unstable?: boolean
    shadow?: boolean
    definitionOptions?: ElementDefinitionOptions
  } = {
    shadow: true,
    unstable: false
  }
) {
  const propNames = (option?.propList ?? getFuncArgNames(builder)).map((name) =>
    name.toLowerCase()
  )

  const clazz = class extends ReactiveElement {
    constructor() {
      super(builder, option.shadow ?? true, propNames, option.unstable ?? false)
    }
  }

  customElements.define(name, clazz, option.definitionOptions)
  componentPool.set(name, propNames)

  return (...props: Parameters<F>) => new VirtualElement(name, props)
}

export class VirtualElement extends DoAble(Object) {
  el?: ReactiveElement
  slotContent?: HTMLClip
  constructor(public tag: string, public props?: unknown[]) {
    super()
  }

  createInstance() {
    this.el = document.createElement(this.tag) as ReactiveElement
    this.slotContent &&
      this.el.append(
        this.slotContent?.do(createClip).tryUpdate(this.slotContent.do(getVals))
          .dof
      )
    this.props && this.el.mergeProps(this.props)
    return this.el
  }

  useSlot(content?: HTMLClip) {
    content && (this.slotContent = content)
    return this
  }
}
