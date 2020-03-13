import { ShallowClip, Clip } from './clip'
import { getPropsFromFunction } from './utils'
import { ComponentNamingError, ComponentExistError } from './error'
import { createProxy } from './reactive'

let currentElement = null

export const componentPool = new Set<string>()

export abstract class UpdatableElement<P extends object> extends HTMLElement {
  $props: P | undefined
  $state: unknown
  constructor(initProp?: P) {
    super()
    this.$props = initProp
      ? createProxy(
          initProp,
          () => {
            setTimeout(() => {
              this.update()
            }, 0)
          },
          undefined,
          false
        )
      : undefined
  }

  connectedCallback() {
    currentElement = this
    console.log(currentElement)
  }

  abstract update(): void
}

export function component<P extends object>(
  name: string,
  builder: (props?: P) => ShallowClip
) {
  if (!checkComponentName(name)) {
    throw ComponentNamingError
  }
  if (componentPool.has(name)) {
    throw ComponentExistError
  }
  let { defaultProp } = getPropsFromFunction(builder)

  const Clazz = class extends UpdatableElement<P> {
    initShaClip: ShallowClip
    clip: Clip
    updatable: boolean = false

    constructor() {
      super(defaultProp)
      // console.log(this.$props)
      this.initShaClip = builder({ ...defaultProp, ...this.$props } as P)
      this.clip = this.initShaClip.createInstance()
      // console.log(Clazz.initShaClip)
      this.clip.init()
      this.attachShadow({ mode: 'open' }).appendChild(this.clip.dof)
      // console.log(this.$props)
    }

    update() {
      console.log(this.$props)
      // debugger
      this.clip.update(builder(this.$props).vals)
    }

    disconnectedCallback() {}

    adoptedCallback() {}
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
