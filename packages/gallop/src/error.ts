export const ComponentNamingError = (name: string) =>
  new SyntaxError(
    `The provided name "${name}" is not a valid custom element name.`
  )

export const ComponentDuplicatedError = (name: string) =>
  new Error(
    `Duplicated name "${name}". The CustomElementRegistry already contains an entry with the same name or the same constructor (or is otherwise already defined), or extends is specified and it is a valid custom element name, or extends is specified but the element it is trying to extend is an unknown element.`
  )

export const LockedProxyError = (target: object) =>
  new Error(
    `Can not set new property to locked object "${JSON.stringify(target)}".`
  )
