const generateMarker = () => `{{${String(Math.random()).slice(2)}}}`

const markerIndex = generateMarker()

export const Marker = {
  clip: {
    start: `<!--$cliphead$${markerIndex}-->`,
    end: `<!--$cliptail$${markerIndex}-->`
  },
  text: `<!--$text$${markerIndex}-->`,
  func: `<!--$func$${markerIndex}-->`,
  attr: `<!--$attr$${markerIndex}-->`,
  prop: `<!--$prop$${markerIndex}-->`,
  clips: {
    start: `<!--$clipshead$${markerIndex}-->`,
    end: `<!--$clipstail$${markerIndex}-->`
  }
}
