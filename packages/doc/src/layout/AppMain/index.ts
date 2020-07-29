import { component, html, useStyle, useState } from '@gallop/gallop'
import raw from './index.scss?raw'
import { CodeSandboxIcon } from '@doc/components/Icons/CodeSandboxIcon'
import { LanguageIcon } from '@doc/components/Icons/LanguageIcon'
import './DocGuide'

component('app-main', () => {
  const [state] = useState({
    playgroundVisible: false
  })
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
      <doc-guide></doc-guide>
    </div>
  `
})
