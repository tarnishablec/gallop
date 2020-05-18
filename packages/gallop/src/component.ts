import { Clip, HTMLClip, createClip, getVals, getShaHtml } from './clip'
// import { getFuncArgNames, extractProps } from './utils'
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

export type ComponentArgs = [object?, ...any[]]
export type Component = (...args: any) => HTMLClip
// export type AsyncComponent = (...props: any[]) => Promise<HTMLClip>
export type Complex<P extends object> = (...args: any) => VirtualElement
export type EffectInfo = { e: Effect; index: number }

export abstract class ReactiveElement<
  P extends object = any
> extends HTMLElement {
  $props: P = createProxy({}, () => this.requestUpdate()) as P
  $state?: [unknown]
  $root: ShadowRoot | ReactiveElement<P>
  $builder: Component
  $alive: boolean = false

  $updateEffects?: EffectInfo[]
  $mountedEffects?: EffectInfo[]
  $disconnectedEffects?: (() => void)[]

  // $brobs: any = createProxy({}, () => this.requestUpdate())
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

  constructor(builder: Component, shadow: boolean, unstable: boolean) {
    super()
    this.$unstable = unstable
    this.$builder = builder
    this.$root = shadow ? this.attachShadow({ mode: 'open' }) : this
    this.requestUpdate()
    // console.log(`${this.nodeName} constructed`)
  }

  requestUpdate() {
    updateQueue.add(this)
    enUpdateQueue()
  }

  dispatchUpdate() {
    const shaClip = this.$builder.apply(this, [this.$props])
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

  mergeProps(props?: object) {
    props && Object.assign(this.$props, props)
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

export const componentPool = new Map<string, boolean>()

export function component<F extends Component>(
  name: string,
  builder: F,
  option: {
    unstable?: boolean
    shadow?: boolean
    definitionOptions?: ElementDefinitionOptions
  } = {
    shadow: true,
    unstable: false
  }
) {
  const clazz = class extends ReactiveElement {
    constructor() {
      super(builder, option.shadow ?? true, option.unstable ?? false)
    }
  }

  customElements.define(name, clazz, option.definitionOptions)
  componentPool.set(name, true)

  return (...args: Parameters<F>) => new VirtualElement(name, args)
}

export class VirtualElement extends DoAble(Object) {
  el?: ReactiveElement
  slotContent?: HTMLClip
  constructor(public tag: string, public args?: ComponentArgs) {
    super()
  }

  createInstance() {
    this.el = document.createElement(this.tag) as ReactiveElement
    this.slotContent &&
      this.el.append(
        this.slotContent?.do(createClip).tryUpdate(this.slotContent.do(getVals))
          .dof
      )
    this.args && this.el.mergeProps(this.args[0])
    return this.el
  }

  useSlot(content?: HTMLClip) {
    content && (this.slotContent = content)
    return this
  }
}
