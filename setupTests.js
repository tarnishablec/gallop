global.Range = function Range() {}

/**
 * there is a wrong implementation in
 * https://stackoverflow.com/questions/42213522/mocking-document-createrange-for-jest
 * watch out ❗
 */
const createContextualFragment = (html) => {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content
}

Range.prototype.createContextualFragment = (html) =>
  createContextualFragment(html)

// HACK: Polyfil that allows codemirror to render in a JSDOM env.
global.window.document.createRange = () => {
  return {
    setEnd: () => {},
    setStart: () => {},
    getBoundingClientRect: () => {
      return { right: 0 }
    },
    getClientRects: () => [],
    createContextualFragment
  }
}
