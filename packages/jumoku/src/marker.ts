const generateMarker = () => `{{${String(Math.random()).slice(2)}}}`

const markerIndex = generateMarker()

export const Marker = {
  clip: `<!--$clip$${markerIndex}-->`,
  text: `<!--$text$${markerIndex}-->`,
  func: `<!--$func$${markerIndex}-->`,
  attr: `<!--$attr$${markerIndex}-->`,
  prop: {
    binding: `<!--$bprop$${markerIndex}-->`,
    static: `<!--$sprop$${markerIndex}-->`
  },
  clips: `<!--$clips$${markerIndex}-->`
}
