import { ShallowClip } from './clip'
import { getPropsFromFunction } from './utils'
import { componentNamingError, componentExistError } from './error'
import { UpdatableElement } from './updatableElement'
import { render } from './render'

export const componentPool = new Set<string>()

export type Component = (props?: unknown) => ShallowClip

export function component<P extends object>(
  name: string,
  builder: (props?: P) => ShallowClip
) {
  if (!checkComponentName(name)) {
    throw componentNamingError
  }
  if (componentPool.has(name)) {
    throw componentExistError
  }
  let { propsNames, defaultProp } = getPropsFromFunction(builder)
  let initClip = builder(defaultProp)

  const Clazz = class extends UpdatableElement<P> {
    clip: ShallowClip = initClip

    updatable: boolean = false

    constructor() {
      super(defaultProp!)
      render(initClip, this.attachShadow({ mode: 'open' }))
    }

    static get observedAttributes() {
      return propsNames.map(p => `:${p}`)
    }

    connectedCallback() {
      this.enableUpdate()
      // console.log(`connected ${this.localName}`)
    }

    enableUpdate() {
      this.updatable = true
    }

    disconnectedCallback() {
    }

    adoptedCallback() {
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
