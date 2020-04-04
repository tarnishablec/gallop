import { component, UpdatableElement, verifyComponentName } from './component'
import { html } from '.'
import { useEffect } from './hooks'
import { range } from './clip'
import { removeNodes } from './dom'

export const DynamicComponent = () =>
  component(
    'dyna-mic',
    function (this: UpdatableElement, is: string) {
      useEffect(() => {
        if (!is || !verifyComponentName(is)) {
          throw new SyntaxError('Dynamic Component syntax error')
        }

        let removed = removeNodes(this.$root)

        const el = this.$root.appendChild(
          range.createContextualFragment(`<${is}></${is}>`).firstChild!
        ) as Element

        el.append(removed)

        if (el instanceof UpdatableElement) {
          this.$brobs.forEach((val, key) => {
            el.mergeProps(key, val)
          })
        }
      }, [])

      return html``
    },
    ['is'],
    false
  )
