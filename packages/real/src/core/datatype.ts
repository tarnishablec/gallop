export enum PRIMITIVE_TYPE {
  BOOLEAN = 'BOOLEAN',
  NUMBER = 'NUMBER',
  UNDEFINED = 'UNDEFINED',
  NULL = 'NULL',
  STRING = 'STRING',
  BIGINT = 'BIGINT',
  SYMBOL = 'SYMBOL'
}

export enum ADVANCE_TYPE {
  RECORD = 'RECORD',
  IMAGE = 'IMAGE'
}

export const INPUT_TYPES = { ...PRIMITIVE_TYPE, ...ADVANCE_TYPE } as const

export type INPUT_TYPE = typeof INPUT_TYPES[keyof typeof INPUT_TYPES]

export type COMPLEX_TYPE = INPUT_TYPE | Array<INPUT_TYPE>

export class DataType<V> {
  constructor(
    public name: string,
    public type: COMPLEX_TYPE,
    public defaultValue: V
  ) {}
}

export const BOOLEAN_TYPE = new DataType(
  INPUT_TYPES.BOOLEAN.toString(),
  INPUT_TYPES.BOOLEAN,
  false
)

export const NUMBER_TYPE = new DataType(
  INPUT_TYPES.NUMBER.toString(),
  INPUT_TYPES.NUMBER,
  0
)
