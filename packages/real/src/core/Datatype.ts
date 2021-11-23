import type { Entity } from './Entity'

export enum PRIMITIVE_TYPE {
  BOOLEAN = 'BOOLEAN',
  UNDEFINED = 'UNDEFINED',
  NULL = 'NULL',
  STRING = 'STRING',
  BIGINT = 'BIGINT',
  SYMBOL = 'SYMBOL'
}

export enum ADVANCE_TYPE {
  REFRENCE = 'REFRENCE',
  VECTOR1 = 'VECTOR1',
  VECTOR2 = 'VECTOR2'
}

export const INPUT_TYPES = { ...PRIMITIVE_TYPE, ...ADVANCE_TYPE } as const

export type INPUT_TYPE = typeof INPUT_TYPES[keyof typeof INPUT_TYPES]

export type COMPLEX_TYPE = INPUT_TYPE | Array<INPUT_TYPE>

export class DataType<V> {
  name: string

  constructor(
    public readonly inputType: COMPLEX_TYPE,
    public readonly defaultValue: V,
    public readonly equalFn: (a: V, b: V) => boolean = (a, b) => a === b,
    public readonly cloneFn: (val: V) => V = (val) => val
  ) {
    this.name = inputType.toString()
  }
}

export const BOOLEAN_TYPE = new DataType(INPUT_TYPES.BOOLEAN, false)

export const NUMBER_TYPE = new DataType(INPUT_TYPES.VECTOR1, 0)

export const STRING_TYPE = new DataType(INPUT_TYPES.STRING, '')

export const REFRENCE_TYPE = new DataType<Entity['id'] | undefined>(
  INPUT_TYPES.REFRENCE,
  undefined
)

export const VECTOR2_TYPE = new DataType<[number, number]>(
  INPUT_TYPES.VECTOR2,
  [0, 0],
  (a, b) => a[0] === b[0] && a[1] === b[1],
  (v) => [...v]
)
