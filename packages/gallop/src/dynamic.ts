import { component, UpdatableElement } from './component'
import { html } from '.'
import { useEffect, useState } from './hooks'
import { removeNodes } from './dom'

export const DynamicComponent = component(
  'dyna-mic',
  function (this: UpdatableElement, is: string) {
    let [state] = useState(
      { first: true, inner: undefined, instance: undefined } as {
        first: boolean
        inner?: Node[]
        instance?: Element
      },
      false
    )

    useEffect(() => {
      state.inner = Array.from(removeNodes(this.$root).childNodes)
    }, [])

    useEffect(() => {
      const el = document.createElement(is)
      el.append(...state.inner!)
      removeNodes(this.$root)
      state.instance = this.$root.appendChild(el)
    }, [is])

    useEffect(() => {
      console.log('trrr')
      const instance = state.instance
      if (instance instanceof UpdatableElement) {
        for (const key in this.$brobs) {
          const element = this.$brobs[key]
          instance.mergeProp(key, element)
        }
      }
    })
    return html``
  },
  ['is'],
  false
)
