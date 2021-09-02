type CreateResult<T extends { destroy: unknown }> = {
  destroy: T['destroy']
}

export interface IViewItem {
  create(): CreateResult<this>
  destroy(): unknown
}

export interface IEditor extends IViewItem {
  destroy(): number
}

export interface IPanel extends IViewItem {
  destroy(): string
}

export const editor: IEditor = {
  destroy() {
    return 0
  },
  create() {
    return { destroy: () => 2 }
  }
}

export const panel: IPanel = {
  destroy() {
    return '0'
  },
  create() {
    return { destroy: () => '2' }
  }
}
