import { Component } from '@real/core/Component'
import { Class } from '@real/utils/type'

export abstract class System {
  public abstract readonly selector: readonly Class<Component>[]
}
