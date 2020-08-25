import { Looper, directive } from '@gallop/gallop'
import type { ReactiveElement } from '@gallop/gallop'

export interface Route {
  key: string | number | symbol
  view: unknown
  meta?: unknown
}

export interface Chunk {
  name: string | number | symbol
  current: Route['key']
  routes: Route[]
  watchList: Set<ReactiveElement>
}

export interface RouterOptions {}

export interface IRouter {
  main: Chunk
  chunks: Chunk[]

  push(): void
  replace(): void
  forward(): void
  go(): void
  back(): void
}

export class Router implements IRouter {
  main: Chunk
  chunks: Chunk[]

  constructor({ chunks, main = chunks[0] }: { chunks: Chunk[]; main?: Chunk }) {
    this.chunks = chunks
    this.main = main
  }

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

export const useChunk = (chunk: Chunk) => {
  const current = Looper.resolveCurrent()
  chunk.watchList.add(current)
  return directive(() => (part) => {
    part.setValue(chunk.routes.find((v) => v.key === chunk.current)?.view)
  })
}
