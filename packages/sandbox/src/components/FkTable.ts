import { component, ReactiveElement, html, useEffect } from '@gallop/gallop'

export const FkTable = component('fk-table', function (this: ReactiveElement) {
  useEffect(() => {
    this.$on('mycustomevent', (e: CustomEventInit) => {
      console.log(`mycustomevent`, e.detail)
    })
    this.$on('click', (e) => {
      console.log(e, e.detail)
    })
    this.$emit(new CustomEvent('mycustomevent', { detail: 'world' }))
    this.$emit(new Event('click'))
  }, [])

  return html` <table>
    <caption>
      Superheros and sidekicks
    </caption>
    <colgroup>
      <col />
      <col span="2" class="batman" />
      <col span="2" class="flash" />
    </colgroup>
    <tr>
      <td></td>
      <th scope="col">Batman</th>
      <th scope="col">Robin</th>
      <th scope="col">The Flash</th>
      <th scope="col">Kid Flash</th>
    </tr>
    <tr>
      <th scope="row">Skill</th>
      <td>Smarts</td>
      <td>Dex, acrobat</td>
      <td>Super speed</td>
      <td>Super speed</td>
    </tr>
  </table>`
})
