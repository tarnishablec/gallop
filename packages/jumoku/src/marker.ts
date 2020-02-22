export const generateMarker = () => `{{${String(Math.random()).slice(2)}}}`

export const markerIndex = generateMarker()

export const Marker = {
  clip: `<!--$clip$${markerIndex}-->`,
  text: `<!--$text$${markerIndex}-->`,
  func: `$func$${markerIndex}`,
  attr: `$attr$${markerIndex}`,
  clipArray: `<!--$clips$${markerIndex}-->`
}
