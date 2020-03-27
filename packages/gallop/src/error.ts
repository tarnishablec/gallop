export const ComponentNamingError = new SyntaxError(
  '	The provided name is not a valid custom element name.'
)

export const ComponentDuplicatedError = new Error(
  '	The CustomElementRegistry already contains an entry with the same name or the same constructor (or is otherwise already defined), or extends is specified and it is a valid custom element name, or extends is specified but the element it is trying to extend is an unknown element.'
)
