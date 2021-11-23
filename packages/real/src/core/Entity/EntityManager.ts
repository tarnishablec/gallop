import { Class, ComponentKey } from '@real/utils/type'
import { Entity } from '.'
import { Component } from '../Component'

export class EntityManager {
  protected static _instance: EntityManager

  protected constructor() {}

  static get instance(): EntityManager {
    return (
      EntityManager._instance ?? (EntityManager._instance = new EntityManager())
    )
  }

  protected entityPool = new Map<Entity['id'], Entity>()

  getEntities<T extends readonly Class<Component>[]>(archetypes: T): Entity[] {
    console.log(archetypes)
    return []
  }

  createEntity(amount: number = 1): Entity['id'][] {
    const entity = new Entity()
    return [entity.id]
  }
}
