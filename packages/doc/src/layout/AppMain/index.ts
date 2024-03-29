import {
  component,
  html,
  useStyle,
  useState,
  css,
  useEffect,
  type ReactiveElement
} from '@gallop/gallop'
import raw from './index.scss?inline'
import { CodeSandboxIcon } from '@doc/components/Icons/CodeSandboxIcon'
import { LanguageIcon } from '@doc/components/Icons/LanguageIcon'
import './DocGuide'
import './DocApi'
import './LanguageSelector'
import { loadPlayground } from '@doc/components/Playground'

component('app-main', function (this: ReactiveElement) {
  const [state] = useState({
    playgroundVisible: false,
    languageSelectVisible: false
  })

  useStyle(() => raw, [])

  useStyle(
    () =>
      css`
        .app-main-wrapper {
          transition: transform 0.2s;
          transform: translateY(${state.languageSelectVisible ? '60px' : '0'});
        }

        doc-guide,
        doc-api {
          /* transform: scale(0.95); */
        }
      `,
    [state.languageSelectVisible]
  )

  useEffect(() => {}, [])

  return html`
    <nav>
      ${LanguageIcon({
        onClick: () =>
          (state.languageSelectVisible = !state.languageSelectVisible)
      })}
      ${CodeSandboxIcon({
        onClick: () => {
          state.playgroundVisible = !state.playgroundVisible
          loadPlayground.call(
            this.$root.querySelector<ReactiveElement<{}, { active: boolean }>>(
              'play-ground'
            )!
          )
        },
        active: state.playgroundVisible
      })}
      <a style="color: black"><strong>guide</strong></a>
      <a>/ api</a>
      <a href="https://gitter.im/gallopweb/community">/ chat</a>
    </nav>
    <play-ground
      .class="${state.playgroundVisible ? 'visible' : ''}"
    ></play-ground>
    <language-selector></language-selector>
    <div
      class="app-main-wrapper"
      @click="${() => (state.languageSelectVisible = false)}"
    >
      <doc-guide></doc-guide>
      <doc-api></doc-api>
    </div>
  `
})
