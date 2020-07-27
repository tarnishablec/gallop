import {
  component,
  html,
  repeat,
  useContext,
  useStyle,
  css,
  useState,
  ReactiveElement,
  useEffect
} from '@gallop/gallop'
import { menuData, localeContext, localeData } from '../../contexts'
import { lang } from '@doc/language'
import url from './index.scss?url'
import { CodeSandboxIcon } from '@doc/components/Icons/CodeSandbox'

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

  useStyle(
    () =>
      css`
        @import '${url}';
      `,
    []
  )

  return html`
    <nav>
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
            ${repeat(
              m.children,
              (c) => c,
              (c) =>
                html`<div class="markdown-wrapper">
                  <h3 class="sub-title" .id="${c}">${lang(c, locale)}</h3>
                  <mark-down
                    :locale="${locale}"
                    :filename="${c
                      .toLowerCase()
                      .split(' ')
                      .filter(Boolean)
                      .join('-') + '.md'}"
                  ></mark-down>
                </div> `
            )}
          `
        )}
      </div>
    </div>
  `
})
