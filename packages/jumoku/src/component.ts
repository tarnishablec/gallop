import { Clip } from './clip'
import { getPropsFromFunction } from './utils'
import { componentNamingError } from './error'

export function component<P>(
  name: string,
  builder: (props: P) => Clip
) {
  if (!checkComponentName(name)) {
    throw componentNamingError
  }
  let { propsNames, defaultValue } = getPropsFromFunction(builder)
  let defaultClip = builder(defaultValue)

  const Clazz = class extends HTMLElement {
    static strs = defaultClip.strs
    static shallowDof = defaultClip.shallowDof
  
    constructor() {
      super()
      // this.attachShadow({ mode: 'open' }).appendChild( )
    }

    mount() {
      // this.shadowRoot?.innerHTML = getFragmentContent()
    }

    update() {}

    static get observedAttributes() {
      return propsNames.map(p => `:${p}`)
    }

    connectedCallback() {
      console.log('connected')
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
    ) {}
  }
  customElements.define(name, Clazz)
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
