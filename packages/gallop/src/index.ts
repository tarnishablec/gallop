export { html, css } from './parse'
export { render } from './render'
export { HTMLClip, getVals } from './clip'
export { Patcher } from './patcher'

export type { SyntaxMap } from './patcher'

export { Looper } from './loop'

export { createProxy } from './reactive'

export {
  component,
  mergeProp,
  mergeProps,
  queryPoolAll,
  queryPool,
  elementPool,
  componentPool,
  observeDisconnect,
  isReactive
} from './component'

export type { ReactiveElement, Component } from './component'

export { Context, createContext, type ContextOptions } from './context'

export {
  useState,
  useContext,
  useEffect,
  useMemo,
  useStyle,
  useRef,
  // advanced hooks
  useDepends,
  useHookCount,
  useLastHookEl
} from './hooks'

export { NodePart, AttrPart, PropPart, EventPart, BoolPart } from './part'

export type { Part } from './part'

export {
  directive,
  directives,
  resolveDirective,
  ensurePartType,
  checkDependsDirty
} from './directive'

export type { DirectiveFn } from './directive'

/** @deprecated */
export {
  repeat,
  dynamic,
  suspense,
  portal,
  raw,
  keep,
  alive,
  setAlive
} from './directives'

export * from './error'

export { forceGet } from './utils'
export type { Key, Obj } from './utils'

export { createFragment, insertAfter, cleanDomStr, removeNodes } from './dom'
