import { Addon } from '@gallop/real'

export default class TestAddon extends Addon {
  name: string = TestAddon.name

  override onLoaded = async () => {
    console.log(111)
  }
}
