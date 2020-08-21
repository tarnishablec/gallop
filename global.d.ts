declare module '*.scss' {}
declare module '*.css' {}

declare module '*.scss?link' {
  const content: string
  export default content
}

declare module '*.css?link' {
  const content: string
  export default content
}

declare module '*.scss?url' {
  const content: string
  export default content
}

declare module '*.css?url' {
  const content: string
  export default content
}

declare module '*.scss?raw' {
  const content: string
  export default content
}

declare module '*.css?raw' {
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
}

interface ImportMeta {}

declare namespace Reflect {
  function get<T extends object, P extends PropertyKey>(
    target: T,
    propertyKey: P,
    receiver?: T
  ): P extends '__raw__' ? T : P extends keyof T ? T[P] : unknown
  // ): P extends '__raw__' ? T : T[keyof T]
}
