import type { Component } from '@real/core/Component'
import type { Class, ComponentDraft } from '@real/utils/type'
import type { Entity } from '@real/core/Entity'

export abstract class System<T extends readonly Component[]> {
  public abstract readonly collector: readonly Class<T[number]>[]

  protected entityList: Entity['id'][] = []

  awake(): void {}

  abstract process(drafts: readonly ComponentDraft<T[number]>[]): void
}
