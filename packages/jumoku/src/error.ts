export const ComponentNamingError = new Error(
  `name of component should be lower case & two or more words`
)

export const ComponentExistError = new Error('this name has been used!!!')

export const NoTypePartError = new Error('no type part is not allowed')

export const LockedProxyError = new Error(
  'can not set new propty locked object'
)

export const NotUpdatableError = new Error(
  'props can only be used on updatable element'
)

export const DuplicatedKeyError = new Error(`key value duplicated`)
