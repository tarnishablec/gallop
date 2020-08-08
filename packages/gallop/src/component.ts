import { HTMLClip, createPatcher, getVals } from './clip'
import { Patcher } from './patcher'
import { Obj, extractProps } from './utils'
import { Looper } from './loop'
import { createProxy } from './reactive'
import { Context } from './context'

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
  $root: ReactiveElement | ShadowRoot
  $patcher?: Patcher
  $isReactive: boolean

  $props: Props
  $state?: State
  $contexts: Set<Context<Obj>>

  requestUpdate(): void
  dispatchUpdate(): void

  queryRoot<T = ReactiveElement>(selector: string): T | undefined
}

export function component<F extends Component>(
  name: string,
  builder: F,
  { shadow = true, extend = undefined, Inherit = HTMLElement }: RegisterOption = {}
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
    $contexts = new Set<Context<Obj>>()

    $isReactive = true

    requestUpdate() {
      Looper.enUpdateQueue(this)
    }
    dispatchUpdate() {
      const clip = this.$builder.call(this, this.$props)
      if (!this.$patcher) {
        this.$patcher = clip.do(createPatcher)
        this.$root.append(this.$patcher.dof)
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

    queryRoot<T = ReactiveElement>(selectors: string): T | undefined {
      return (this.$root.querySelector(selectors) as unknown) as T
    }
  }
  customElements.define(name, clazz, { extends: extend })
  componentPool.add(name)
}

export const observeDisconnect = (
  el: ReactiveElement,
  callback: EventListenerOrEventListenerObject
) => {
  el.addEventListener('$disconnected$', callback)
}

export const isReactive = (node: Node | null): node is ReactiveElement =>
  !!(node && Reflect.get(node, '$isReactive'))

export const mergeProp = (node: ReactiveElement, name: string, value: unknown) =>
  Reflect.set(node.$props, name, value)

export const mergeProps = (node: ReactiveElement, value: unknown) =>
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

export const queryPool = (
  ...selector: Parameters<typeof queryPoolAll>
): ReactiveElement | undefined => queryPoolAll(...selector)[0]
