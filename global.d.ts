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

type RequestIdleCallbackHandle = number
type RequestIdleCallbackOptions = {
  timeout: number
}
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean
  timeRemaining: () => number
}

interface Window {
  requestIdleCallback?: (
    callback: (deadline: RequestIdleCallbackDeadline) => void,
    options?: RequestIdleCallbackOptions
  ) => RequestIdleCallbackHandle
  cancelIdleCallback?: (handle: RequestIdleCallbackHandle) => void
  MonacoEnvironment: import('monaco-editor/esm/vs/editor/editor.api').Environment
}

// declare interface ImportMeta {}

declare namespace Reflect {
  function get<T extends object, P extends PropertyKey>(
    target: T,
    propertyKey: P,
    receiver?: T
  ): P extends typeof import('@gallop/gallop/src/reactive').__raw__
    ? T
    : P extends keyof T
    ? T[P]
    : undefined
}
