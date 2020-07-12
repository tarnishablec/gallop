declare module '*.scss' {}

declare module '*.css' {}

type RequestIdleCallbackHandle = number
type RequestIdleCallbackOptions = {
  timeout: number
}
type RequestIdleCallbackDeadline = {
  readonly didTimeout: boolean
  timeRemaining: () => number
}

interface Window {
  requestIdleCallback: (
    callback: (deadline: RequestIdleCallbackDeadline) => void,
    opts?: RequestIdleCallbackOptions
  ) => RequestIdleCallbackHandle
  cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void
}

interface ImportMeta {}

declare namespace Reflect {
  function get<T extends object, P extends PropertyKey>(
    target: T,
    propertyKey: P,
    receiver?: T
  ): P extends '__raw__' ? T : T[keyof T]
}
