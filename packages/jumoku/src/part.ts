export interface Part {
  readonly value: unknown

  setValue(value: unknown): void

  commit(): void
}
