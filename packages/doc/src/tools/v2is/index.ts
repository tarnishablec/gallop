/* eslint-disable no-console */
import {
  useState,
  render,
  html,
  component,
  useStyle,
  css,
  useEffect,
  useRef
} from '@gallop/gallop'
import VideoSnapshot from 'video-snapshot'
import { get } from 'lodash'
import JSZip from 'jszip'

component('app-v2is', function () {
  const [state] = useState({
    video: ''
  })

  useStyle(
    () => css`
      .root {
        display: grid;
        row-gap: 5px;
      }
    `,
    []
  )

  const textareaRef = useRef<HTMLTextAreaElement>()

  useEffect(() => {
    textareaRef.current = this.$root.querySelector('textarea')!
  }, [])

  return html` <div class="root">
    <input
      type="file"
      multiple="false"
      accept=".mp4"
      @change="${(e: InputEvent) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (file) {
          const url = URL.createObjectURL(file)
          state.video = url

          MediaInfo({ format: 'object' }).then((mediainfo) => {
            mediainfo
              .analyzeData(
                () => file.size,
                (chunkSize, offset) =>
                  new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      if (event.target?.error) {
                        reject(event.target.error)
                      }
                      const result = event.target?.result
                      if (result && typeof result !== 'string') {
                        resolve(new Uint8Array(result))
                      }
                    }
                    reader.readAsArrayBuffer(
                      file.slice(offset, offset + chunkSize)
                    )
                  })
              )
              ?.then(async (res) => {
                const duration = Number(get(res, 'media.track[1].Duration'))
                let cur = 0
                const step = 1 / 30
                const vs = new VideoSnapshot(file)
                let i = 0
                const zip = new JSZip()
                while (cur < duration) {
                  const ss = await vs.takeSnapshot(cur)
                  zip?.file(`ref ${i}.png`, ss.split(',')[1], { base64: true })
                  cur += step
                  console.log(i)
                  i++
                }

                zip
                  .generateAsync({ type: 'blob' }, (metadata) => {
                    console.log(metadata)
                  })
                  .then((blob) => {
                    const url = window.URL.createObjectURL(blob)
                    window.location.assign(url)
                  })
              })
          })
        }
      }}"
    />
    <div>
      <video .src="${state.video}" controls></video>
    </div>
    <div>
      <textarea id="video-info"></textarea>
    </div>
  </div>`
})

render(html`<app-v2is></app-v2is>`)
