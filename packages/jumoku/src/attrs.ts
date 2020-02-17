import { boundAttrRegex } from './regexps'

export const getBoundAttrName = (front: string) =>
  front.match(boundAttrRegex)![1]

export const boundAttrSuffix = `$attr$`
