import { component, UpdatableElement } from './component'
import { html } from '.'
import { useEffect, useState } from './hooks'
import { range } from './clip'
import { removeNodes } from './dom'

export const DynamicComponent = () =>
  component(
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
        const el = range.createContextualFragment(`<${is}></${is}>`)
          .firstChild as Element

        const temp = new DocumentFragment()
        state.inner!.forEach((node) => {
          temp.append(node)
        })

        el.append(temp)

        removeNodes(this.$root)

        this.$root.append(el)

        if (el instanceof UpdatableElement) {
          this.$brobs.forEach((val, key) => {
            el.mergeProp(key, val)
          })
        }
      }, [is])

      return html``
    },
    ['is'],
    false
  )
