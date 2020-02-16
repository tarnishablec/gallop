export const render = (val: DocumentFragment) => {
  document.querySelector(`#app`)?.appendChild(val)
}
