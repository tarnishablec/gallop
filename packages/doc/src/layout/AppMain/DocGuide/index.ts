import {
  component,
  html,
  repeat,
  useContext,
  useEffect,
  type ReactiveElement,
  useStyle,
  queryPool
} from '@gallop/gallop'
import { localize } from '@doc/language'
import { menuData, localeContext } from '@doc/contexts'
import raw from './index.scss?inline'

component('doc-guide', function (this: ReactiveElement) {
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

      const appMainState = queryPool<
        ReactiveElement<{}, { languageSelectVisible: boolean }>
      >({
        name: 'app-main'
      })?.$state

      await new Promise<void>((res) => {
        if (appMainState?.languageSelectVisible) {
          appMainState.languageSelectVisible = false
          setTimeout(() => res(), 201)
        } else {
          res()
        }
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

  const [{ locale }] = useContext(localeContext)

  return html`<article class="doc-guide-main">
    ${repeat(
      menu,
      (m) => m.name,
      (m) => html`
        <h2 class="primary-title" .id="${m.name}">
          ${localize(m.name, locale)}
        </h2>
        <hr />
        ${m.children?.length
          ? repeat(
              m.children,
              (c) => c,
              (c) =>
                html`<div class="markdown-wrapper">
                  <h3 class="sub-title" .id="${c}">${localize(c, locale)}</h3>
                  <mark-down :locale="${locale}" :filename="${c}"></mark-down>
                </div> `
            )
          : null}
      `
    )}
  </article> `
})
