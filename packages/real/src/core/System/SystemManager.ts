import { System } from '.'

export class SystemManager {
  protected static _instance: SystemManager
  protected constructor() {}

  static get instance() {
    return (
      SystemManager._instance ?? (SystemManager._instance = new SystemManager())
    )
  }

  protected systemPool: System[] = []

  register() {}
}
