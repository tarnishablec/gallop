import {
  component,
  html,
  repeat,
  useContext,
  useStyle,
  css,
  useState,
  useEffect,
  ReactiveElement
} from '@gallop/gallop'
import { menuData, menuContext, localeContext, localeData } from '../../contexts'
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
    window.addEventListener(
      'hashchange',
      () => (menuData.current = window.location.hash.slice(1).split('?')[0])
    )
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const { target, isIntersecting } = entry
          const name = target.id
          if (isIntersecting) {
            if (name === menuData.current) menuData.dead = false
            menuData.dead ||
              menu.map((v) => v.name).includes(name) ||
              (menuData.current = name)
          }
        })
      },
      { root: this }
    )
    setTimeout(() => {
      this.$root.querySelectorAll('.primary-title').forEach((el) => obs.observe(el))
      this.$root.querySelectorAll('.sub-title').forEach((el) => obs.observe(el))
    }, 1000)
  }, [])

  useContext([menuContext, localeContext])

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
