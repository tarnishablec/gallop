import { ShallowClip } from './clip'
import { getPropsFromFunction } from './utils'
import { componentNamingError } from './error'
import { UpdatableElement } from './updatableElement'
import { shallowRender } from './render'

export const componentPool = new Set<string>()

export type Component = (props?: unknown) => ShallowClip

export function component<P extends object>(
  name: string,
  builder: (props?: P) => ShallowClip
) {
  if (!checkComponentName(name)) {
    throw componentNamingError
  }
  let { propsNames, defaultProp } = getPropsFromFunction(builder)
  let initClip = builder(defaultProp)

  const Clazz = class extends UpdatableElement<P> {
    clip: ShallowClip = initClip

    constructor() {
      super(defaultProp!)
      shallowRender(initClip, this.attachShadow({ mode: 'open' }))
    }

    static get observedAttributes() {
      return propsNames.map(p => `:${p}`)
    }

    connectedCallback() {
      // console.log(`connected ${this.localName}`)
    }

    disconnectedCallback() {
      console.log(`disconnected`)
    }

    adoptedCallback() {
      console.log(`adopted`)
    }

    attributeChangedCallback(
      name: string,
      oldValue: unknown,
      newValue: unknown
    ) {
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
