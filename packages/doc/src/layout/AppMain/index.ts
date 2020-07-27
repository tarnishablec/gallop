import {
  component,
  html,
  repeat,
  useContext,
  useStyle,
  useState,
  ReactiveElement,
  useEffect
} from '@gallop/gallop'
import { menuData, localeContext, localeData } from '../../contexts'
import { lang } from '@doc/language'
import raw from './index.scss?raw'
import { CodeSandboxIcon } from '@doc/components/Icons/CodeSandboxIcon'
import { LanguageIcon } from '@doc/components/Icons/LanguageIcon'

component('app-main', function (this: ReactiveElement) {
  const [state] = useState({
    playgroundVisible: false
  })

  const { locale } = localeData
  const { menu } = menuData

  useEffect(() => {
    const handler = () => {
      const hash = window.location.hash
      this.$root.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
    }
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])

  useContext([localeContext])

  useStyle(() => raw, [])

  return html`
    <nav>
      ${LanguageIcon()}
      ${CodeSandboxIcon({
        onClick: () => (state.playgroundVisible = !state.playgroundVisible),
        active: state.playgroundVisible
      })}
      <a style="color: black"><strong>guide</strong></a>
      <a>/ api</a>
      <a href="https://gitter.im/gallopweb/community">/ chat</a>
    </nav>
    <play-ground .class="${state.playgroundVisible ? 'visible' : ''}"></play-ground>
    <div class="app-main-wrapper">
      <div class="app-main-content">
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
    </div>
  `
})
