import type { Component } from '@real/core/Component'
import type { Class, SelectorToDrafts } from '@real/utils/type'

export abstract class System {
  abstract readonly selector: readonly Class<Component>[]

  public abstract deferred: boolean

  onRegister?(): void

  onActive?(): void

  onDeActive?(): void

  abstract process(
    drafts: SelectorToDrafts<this['selector']>
  ): void | Promise<void>
}
