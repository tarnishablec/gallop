import type { Component } from '@real/core/Component'
import type { Class, SelectorToDraft } from '@real/utils/type'

export abstract class System {
  abstract readonly selector: readonly Class<Component>[]

  awake?(): void

  abstract process(drafts: SelectorToDraft<this['selector']>): void
}
