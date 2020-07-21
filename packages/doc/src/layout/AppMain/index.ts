import { component, html, repeat, useContext, useStyle } from '@gallop/gallop'
import { gloabl, menu, menuContext } from '../../contexts'
import { lang } from '../../language'
import style from '!!to-string-loader!css-loader!sass-loader!./index.scss'

component('app-main', () => {
  useContext([menuContext])

  const { locale } = gloabl

  useStyle(() => style, [])

  return html`
    <nav>
      <a style="color: black"><strong>guide</strong></a>
      <a href="https://gitter.im/gallopweb/community">/ chat</a>
    </nav>
    <div class="app-main-wrapper">
      <div class="app-main-content">
        ${repeat(
          menu,
          (m) => m.name,
          (m) => html`
            <h2 .id="${m.name}">${lang(m.name, locale)}</h2>
            <hr />
            ${repeat(
              m.children,
              (c) => c,
              (c) =>
                html`<h3 .id="${c}">${lang(c, locale)}</h3>
                  <mark-down
                    :locale="${locale}"
                    :filename="${c.toLowerCase() + '.md'}"
                  ></mark-down> `
            )}
          `
        )}
      </div>
    </div>
  `
})
