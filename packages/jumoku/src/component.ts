import { BaseComponent } from './baseComponent'
import { FragmentClip } from './fragmentClip'
import { html } from './parse'

type Options = {
  props: any
  hooks?: any
}

type Component = {}

export function component(
  name: string,
  builder: (options: Options) => FragmentClip
) {
  customElements.define(
    name,
    class extends BaseComponent {
      created(): void {
        throw new Error('Method not implemented.')
      }
      mounted(): void {
        throw new Error('Method not implemented.')
      }
      constructor() {
        super()
        this.attachShadow({ mode: 'open' })
      }
    }
  )
}
