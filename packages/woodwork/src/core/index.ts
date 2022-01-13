import { SerializedAreaTrack } from './AreaTrack'
import { Layout } from './Layout'
import { IWWRenderer, WWRenderer } from './Renderer'
import { IWWSerder, WWSerder } from './Serder'

export class WW {
  public serder: IWWSerder
  public renderer: IWWRenderer

  public viewRegistry = new Map<string, (container: HTMLElement) => unknown>()

  registerView(key: string, viewFn: (container: HTMLElement) => unknown) {
    this.viewRegistry.set(key, viewFn)
  }

  constructor({
    serder = new WWSerder(),
    renderer
  }: {
    serder?: IWWSerder
    renderer?: IWWRenderer
  } = {}) {
    this.serder = serder
    this.renderer = renderer ?? new WWRenderer(this)
  }

  generateLayout({
    name,
    serializedAreaTrack
  }: {
    serializedAreaTrack: SerializedAreaTrack
    name: string
  }) {
    const rootAreaTrack = this.serder.deserializeAreaTrack(serializedAreaTrack)
    return new Layout({ rootAreaTrack, name })
  }
}
