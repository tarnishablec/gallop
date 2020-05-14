export type RouterOption = {
  mode: 'hash' | 'history'
  routes: Route[]
  hooks?: {
    beforeEach: (from: Route, to: Route) => void
    afterEach: (from: Route, to: Route) => void
  }
}

export type Route = {
  path: string
  component?: string | (() => Promise<unknown>)
  exact?: boolean
  meta?: unknown
  children?: Route[]
}

export interface Router {
  push(): void
  replace(): void
  forward(): void
  go(): void
  back(): void
}
