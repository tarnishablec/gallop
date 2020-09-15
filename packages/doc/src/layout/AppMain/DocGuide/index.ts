import {
  component,
  html,
  repeat,
  useContext,
  useEffect,
  ReactiveElement,
  useStyle,
  queryPool
} from '@gallop/gallop'
import { lang } from '@doc/language'
import { menuData, localeContext, localeData } from '@doc/contexts'
import raw from './index.scss?raw'

component('doc-guide', function (this: ReactiveElement) {
  const { locale } = localeData
  const { menu } = menuData

  useStyle(() => raw, [])

  useEffect(() => {
    const startHash = window.location.hash
    window.location.hash &&
      this.$root
        .querySelector(startHash)
        ?.scrollIntoView({ behavior: 'smooth' })

    let timeout: ReturnType<typeof setTimeout>
    const handler = async (e: HashChangeEvent) => {
      const newHash = `#` + e.newURL.split('#').pop()
      if (newHash === '#') return
      clearTimeout(timeout)
      const el = this.$root.querySelector(newHash)

      const appMainState = queryPool<{}, { languageSelectVisible: boolean }>({
        name: 'app-main'
      })?.$state!

      await new Promise((res) => {
        if (appMainState.languageSelectVisible) {
          appMainState.languageSelectVisible = false
          setTimeout(() => res(), 201)
        } else res()
      })
      el?.scrollIntoView({ behavior: 'smooth' })
      timeout = setTimeout(() => {
        window.location.hash = ''
      }, 1750)
    }
    window.addEventListener('hashchange', handler)
    return () => {
      window.removeEventListener('hashchange', handler)
    }
  }, [])

  useContext([localeContext])

  return html`<article class="doc-guide-main">
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
  </article> `
})
