import { AddonMananger } from '../Addon'
import { ComponentManager } from '../Component'

import { version } from '../../../package.json'

export class Application {
  AddonMananger = AddonMananger.getInstance()

  constructor() {}

  version = version

  prepare = async () => {}
}
