import { HTMLClip, getVals } from './clip'
import { Patcher } from './patcher'
import { Obj, extractProps } from './utils'
import { Looper } from './loop'
import { createProxy } from './reactive'
import type { Context } from './context'

export type Component = (...args: any[]) => HTMLClip

type RegisterOption = {
  extend?: keyof HTMLElementTagNameMap
  Inherit?: new () => HTMLElement
  shadow?: boolean
}

export const componentPool = new Set<string>()
export const elementPool = new Map<string, Set<ReactiveElement>>()
export interface ReactiveElement<
  Props extends Obj = Obj,
  State extends Obj | undefined = undefined
> extends HTMLElement {
  $builder: Component
  $root: ReactiveElement<Props, State> | ShadowRoot
  $patcher?: Patcher
  $isReactive: boolean

  $props: Props
  $state: State
  $contexts: Set<Context>

  requestUpdate(): void
  dispatchUpdate(): void
}

export function component<F extends Component>(
  name: string,
  builder: F,
  {
    shadow = true,
    extend = undefined,
    Inherit = HTMLElement
  }: RegisterOption = {}
) {
  const clazz = class extends Inherit implements ReactiveElement {
    $builder = builder
    $root = shadow ? this.attachShadow({ mode: 'open' }) : this
    $patcher?: Patcher = undefined
    $props = createProxy(
      {},
      {
        onMut: () => this.requestUpdate()
      }
    )
    $state = undefined
    $contexts = new Set<Context>()

    $isReactive = true

    requestUpdate() {
      Looper.enUpdateQueue(this)
    }
    dispatchUpdate() {
      const clip = this.$builder.call(this, this.$props)
      if (!this.$patcher) {
        this.$patcher = clip.createPatcher(this)
        this.$patcher.appendTo(this.$root)
      }
      this.$patcher.patch(clip.do(getVals))
    }

    connectedCallback() {
      if (elementPool.has(name)) elementPool.get(name)!.add(this)
      else {
        const set = new Set<ReactiveElement>()
        set.add(this)
        elementPool.set(name, set)
      }
    }
    disconnectedCallback() {
      this.$contexts.forEach((ctx) => ctx.unwatch(this))
      this.dispatchEvent(new CustomEvent('$disconnected$'))
      elementPool.get(name)!.delete(this)
    }

    constructor() {
      super()
      mergeProps(this, extractProps(this.attributes))
      this.requestUpdate()
    }
  }
  componentPool.add(name)
  customElements.define(name, clazz, { extends: extend })
}

export const observeDisconnect = (
  el: ReactiveElement,
  callback: EventListenerOrEventListenerObject
) => {
  el.addEventListener('$disconnected$', callback)
}

export const isReactive = (node: Node | null): node is ReactiveElement =>
  !!(node && Reflect.get(node, '$isReactive'))

export const mergeProp = (
  node: ReactiveElement,
  name: string,
  value: unknown
) => Reflect.set(node.$props, name, value)

export const mergeProps = <T extends Obj>(node: ReactiveElement, value: T) =>
  Object.assign(node.$props, value)

export const queryPoolAll = ({
  name,
  id,
  classnames
}: {
  name: string
  id?: string
  classnames?: string[]
}) =>
  Array.from(elementPool.get(name) ?? []).filter(
    (v) =>
      (id === void 0 || v.id === id) &&
      (classnames === void 0 ||
        new Set([...classnames, ...Array.from(v.classList)]).size ===
          v.classList.length)
  )

export const queryPool = <
  Props extends Obj = Obj,
  State extends Obj | undefined = undefined
>(
  ...selector: Parameters<typeof queryPoolAll>
): ReactiveElement<Props, State> | undefined =>
  queryPoolAll(...selector)[0] as ReactiveElement<Props, State> | undefined
