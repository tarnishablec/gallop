import {
  component,
  html,
  repeat,
  useContext,
  useEffect,
  ReactiveElement,
  useStyle
} from '@gallop/gallop'
import { lang } from '@doc/language'
import { menuData, localeContext, localeData } from '@doc/contexts'
import raw from './index.scss?raw'
import { MarkDown } from '@doc/components/MarkDown'

component('doc-guide', function (this: ReactiveElement) {
  const { locale } = localeData
  const { menu } = menuData

  useStyle(() => raw, [])

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    const handler = (e: HashChangeEvent) => {
      const newHash = `#` + e.newURL.split('#').pop()
      if (newHash === '#') return
      clearTimeout(timeout)
      const el = this.$root.querySelector(newHash)
      el?.scrollIntoView({ behavior: 'smooth' })
      timeout = setTimeout(() => {
        window.location.hash = ''
      }, 2500)
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  useContext([localeContext])

  return html`<div class="doc-guide-main">
    ${repeat(
      menu,
      (m) => m.name,
      (m) => html`
        <h2 class="primary-title" .id="${m.name}">${lang(m.name, locale)}</h2>
        <hr />
        ${m.children?.length
          ? repeat(
              m.children,
              (c) => c,
              (c) =>
                html`<div class="markdown-wrapper">
                  <h3 class="sub-title" .id="${c}">${lang(c, locale)}</h3>
                  ${MarkDown({ filename: c, locale })}
                </div> `
            )
          : null}
      `
    )}
  </div> `
})
