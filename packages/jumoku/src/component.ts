import { ShallowClip, Clip } from './clip'
import { getPropsFromFunction } from './utils'
import { componentNamingError, componentExistError } from './error'
import { Proxyed, createProxy } from './reactive'

let currentElement = null

export const componentPool = new Set<string>()

export abstract class UpdatableElement<P extends object> extends HTMLElement {
  $props: Proxyed<P>
  $state: Proxyed<unknown>
  constructor(prop: P) {
    super()
    this.$props = createProxy(prop, () => this.update())
  }

  connectedCallback() {
    currentElement = this
    console.log(currentElement)
  }
  
  update() {}
}

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
    static initShaClip: ShallowClip = initClip
    clip: Clip
    updatable: boolean = false

    constructor() {
      super(defaultProp!)
      this.clip = new Clip(
        Clazz.initShaClip.getShaDof().cloneNode(true) as DocumentFragment,
        Clazz.initShaClip.shallowParts
      )
      console.log(Clazz.initShaClip)
      this.clip.update(Clazz.initShaClip.vals)
      this.attachShadow({ mode: 'open' }).appendChild(this.clip.dof)
    }

    static get observedAttributes() {
      return propsNames.map(p => `:${p}`)
    }

    enableUpdate() {
      this.updatable = true
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

const mergeProp = () => {}
