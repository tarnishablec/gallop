import { pathToRegexp, match } from 'path-to-regexp'

type RouterData = {
  current: Route
}

export class Router {
  protected static instance: Router
  mode: 'hash' | 'history' = 'hash'

  private constructor() {}

  static getInstance() {
    return Router.instance ?? (Router.instance = new Router())
  }

  push() {}

  replace() {}
}

export class Route {}
