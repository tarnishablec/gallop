function isDocumentFragment(target: any): target is DocumentFragment {
  return target?.nodeType === Node.DOCUMENT_FRAGMENT_NODE
}

function isDocumentFragmentArray(target: any): target is DocumentFragment[] {
  if (Array.isArray(target)) {
    target.forEach(t => {
      if (!isDocumentFragment(t)) {
        return false
      }
    })
    return true
  }
  return false
}

function isFunction(target: any): target is Function {
  return typeof target === 'function'
}

export { isDocumentFragment, isDocumentFragmentArray, isFunction }
