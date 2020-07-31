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

component('doc-guide', function (this: ReactiveElement) {
  const { locale } = localeData
  const { menu } = menuData

  useStyle(() => raw, [])

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash
      this.$root.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  useContext([localeContext])

  return html`<div class="app-main-content">
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
                    <mark-down :locale="${locale}" :filename="${c}"></mark-down>
                  </div> `
              )
            : null}
        `
      )}
    </div>
    <style></style> `
})
