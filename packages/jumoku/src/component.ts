import { FragmentClip } from './fragmentClip'
import { getPropsFromFunction } from './utils'
import { componentNamingError } from './error'

export function component<P>(
  name: string,
  builder: (props: P) => FragmentClip
) {
  if (!checkComponentName(name)) {
    throw componentNamingError
  }
  let { propsNames, defaultValue } = getPropsFromFunction(builder)
  let clazzName = convertClassName(name)
  const Clazz = {
    [clazzName]: class extends HTMLElement {
      clip: FragmentClip
      constructor() {
        super()
        this.clip = builder(defaultValue)
        let shaDof = this.clip.shallowDof
        this.attachShadow({ mode: 'open' }).appendChild(shaDof.cloneNode(true))
      }

      rerender() {
        // this.shadowRoot?.innerHTML = getFragmentContent()
      }

      static get observedAttributes() {
        return propsNames
      }

      connectedCallback() {
        console.log(this + ' connected')
      }

      disconnectedCallback() {}

      adoptedCallback() {}

      attributeChangedCallback(
        name: string,
        oldValue: unknown,
        newValue: unknown
      ) {
        debugger
        console.log(Clazz.observedAttributes)
        console.log(name)
        console.log(newValue)
      }
    }
  }[clazzName]
  customElements.define(name, Clazz)
}

const checkComponentName = (name: string) => {
  const arr = name.split('-')
  return arr[arr.length - 1] && arr.length >= 2 && name.toLowerCase() === name
}

const convertClassName = (name: string) =>
  name
    .split('-')
    .map(n => n.replace(/^[a-z]/, i => i.toUpperCase()))
    .join('')
