export type RouterOption = {
  mode: 'hash' | 'history'
  routes: Route[]
  hooks: {
    beforeEach: (from: Route, to: Route) => void
    afterEach: (from: Route, to: Route) => void
  }
}

export type Route = {
  path: string
  component: string | (() => Promise<unknown>)
  exact?: boolean
  meta?: unknown
  children?: Route[]
}

export class Router {
  private constructor() {}

  static option: RouterOption
  private static inited: boolean = false
  static init(option: RouterOption) {
    if (Router.inited) {
      return
    }
    Router.inited = true

    Router.option = option
  }

  static push() {}
  static replace() {}
  static back() {}
  static forward() {}
  static go() {}
}
