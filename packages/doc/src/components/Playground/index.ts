import { component, html } from '@gallop/gallop'

component(`play-ground`, () => {
  return html`
    <div class="playground-wrapper">
      <iframe
        src="https://codesandbox.io/embed/sandbox-wkqw4?fontsize=14&hidenavigation=1&theme=dark&runonclick=1"
        style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
        title="sandbox"
        allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
        sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </div>
  `
})
