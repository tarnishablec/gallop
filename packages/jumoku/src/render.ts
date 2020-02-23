const appRoot = document.querySelector('#app')!

export const render = (val: DocumentFragment, location: Element = appRoot) => {
  location.querySelector(`#app`)?.appendChild(val)
}
