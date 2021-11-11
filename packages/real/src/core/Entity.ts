import { v4 } from 'uuid'
import { Component } from './Component'

export class Entity {
  public readonly id = v4()
  public components: Component[] = []
}
