import { Part } from './part'

const directivePool = new WeakSet<object>()

export type DirectiveFn = (part: Part) => void

export function directive<F extends (...args: any[]) => DirectiveFn>(f: F) {}
