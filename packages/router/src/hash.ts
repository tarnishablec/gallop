import { IRouter } from './router'

export class HashRouter implements IRouter {
  push(): void {
    throw new Error('Method not implemented.')
  }
  replace(): void {
    throw new Error('Method not implemented.')
  }
  forward(): void {
    throw new Error('Method not implemented.')
  }
  go(): void {
    throw new Error('Method not implemented.')
  }
  back(): void {
    throw new Error('Method not implemented.')
  }
}
