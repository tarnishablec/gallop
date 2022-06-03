// https://github.com/yarnpkg/yarn/issues/8405

declare module 'https://unpkg.com/prettier@2.3.2/esm/standalone.mjs' {
  export * from 'prettier'
}

declare module 'https://unpkg.com/prettier@2.3.2/esm/parser-*.mjs' {
  const content: import('prettier').Plugin
  export default content
}

declare module '*?link' {
  const content: string
  export default content
}

declare module '*?preload' {
  const content: string
  export default content
}

declare module '*.md' {
  const content: { default: string }
  export default content
}

declare const __prod__: boolean

declare module 'worker-loader!*' {
  class WebpackWorker extends Worker {
    constructor()
  }
  export default WebpackWorker
}

// declare interface ImportMeta {}

declare global {
  const CanvasKitInit: typeof import('canvaskit-wasm').CanvasKitInit
  const MediaInfo: typeof import('mediainfo.js').default
  namespace Reflect {
    function get<T extends object, P extends PropertyKey>(
      target: T,
      propertyKey: P,
      receiver?: T
    ): P extends typeof import('./packages/gallop/src/reactive')['__raw__']
      ? T
      : P extends keyof T
      ? T[P]
      : undefined
  }
}

declare module 'type-fest' {
  namespace PackageJson {
    interface NonStandardEntryPoints {
      _buildOptions?: Partial<{
        bundler: 'rollup' | 'vite' | 'esbuild'
        rollupOptions: import('vite').BuildOptions['rollupOptions']
        useMonaco: boolean
      }>
    }
  }
}

export {}
