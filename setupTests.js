/**
 * Jest runner has been replaced from jsdom to jest-electron-runner
 * https://github.com/facebook-atom/jest-electron-runner so there is no need for
 * polyfill of web-components apis this file makes no sense and just be kept for
 * reference
 */

global.Range = function Range() {}

/**
 * There is a wrong implementation in
 * https://stackoverflow.com/questions/42213522/mocking-document-createrange-for-j
 * st watch out ❗
 *
 * @param html String}
 * @returns {DocumentFragment}
 */
const createContextualFragment = (html) => {
  const template = document.createElement('template')
  template.innerHTML = html
  return template.content
}

Range.prototype.createContextualFragment = (html) =>
  createContextualFragment(html)

// require('electron').remote.getCurrentWindow().show()
