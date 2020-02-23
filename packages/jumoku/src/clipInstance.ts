import { FragmentClip } from './fragmentClip'

export class ClipInstance {
  readonly values: unknown[]
  readonly staticHtml: string

  constructor(fragClip: FragmentClip) {
    this.values = fragClip.vals
    this.staticHtml = fragClip.getHtml()
  }

  update() {}
}
