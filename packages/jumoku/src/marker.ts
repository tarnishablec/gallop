export const generateMarker = () => `{{${String(Math.random()).slice(2)}}}`

export const marker = generateMarker()

export const Marker = {
  clip: `<!--$clip$${marker}-->`,
  text: `<!--$text$${marker}-->`,
  func: `$func$${marker}`,
  attr: `$attr$${marker}`,
  clipArray: `<!--$clips$${marker}-->`
}
