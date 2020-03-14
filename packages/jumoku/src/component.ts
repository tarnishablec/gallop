import { ShallowClip, Clip } from './clip'
import { getPropsFromFunction } from './utils'
import { ComponentNamingError, ComponentExistError } from './error'
import { createProxy } from './reactive'

// let currentElement = null

type Compoent<P> = (props?: P) => ShallowClip

export const componentPool = new Set<string>()

export abstract class UpdatableElement<P extends object> extends HTMLElement {
  $props: P | undefined
  $state: unknown
  builder: Compoent<P>
  clip!: Clip

  hooksEnable: boolean = false

  constructor(initProp: P, builder: Compoent<P>) {
    super()
    this.builder = builder
    this.$props = createProxy(
      initProp,
      () => {
        // console.log(`${this.tagName} updated`)
        setTimeout(() => {
          this.update()
        }, 0)
      },
      undefined,
      false
    )
  }

  connectedCallback() {
    // currentElement = this
    this.hooksEnable = true
    // console.log(currentElement)
  }

  disconnectedCallback() {}

  adoptedCallback() {}

  abstract update(): void
}

export function component<P extends object>(
  name: string,
  builder: Compoent<P>
) {
  if (!checkComponentName(name)) {
    throw ComponentNamingError
  }
  if (componentPool.has(name)) {
    throw ComponentExistError
  }
  let { defaultProp } = getPropsFromFunction(builder)

  const Clazz = class extends UpdatableElement<P> {
    static initShaClip: ShallowClip = builder(defaultProp)
    updatable: boolean = false

    constructor() {
      super(defaultProp ?? ({} as P), builder)
      this.clip = Clazz.initShaClip.createInstance()
      this.clip.init()
      this.clip.elementInstance = this
      this.attachShadow({ mode: 'open' }).appendChild(this.clip.dof)
    }

    update() {
      // console.log(this.$props)
      // debugger
      this.clip.update(this.builder(this.$props!).vals)
    }
  }
  customElements.define(name, Clazz)
  componentPool.add(name)
}

const checkComponentName = (name: string) => {
  const arr = name.split('-')
  return arr[arr.length - 1] && arr.length >= 2 && name.toLowerCase() === name
}

export const convertClassName = (name: string) =>
  name
    .split('-')
    .map(n => n.replace(/^[a-z]/, i => i.toUpperCase()))
    .join('')
