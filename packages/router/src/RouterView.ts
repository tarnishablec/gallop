import { component, html, useState, createContext } from '@gallop/gallop'

type RouterViewState = {}

let [routerData, routerContext] = createContext({})

component('router-view', () => {
  let [viewState] = useState({})

  return html``
})
