export interface IWidget {
  create(): void
  destroy(): void
}

export interface IEditor extends IWidget {}

export interface IPanel extends IWidget {}

export interface IMenu {}

// layout dock

export interface IDock {}
