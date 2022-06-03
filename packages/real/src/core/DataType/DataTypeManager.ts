import { DataType } from './index'

export class DataTypeManager {
  protected static _instance: DataTypeManager
  protected constructor() {}

  static get instance() {
    return (
      DataTypeManager._instance ??
      (DataTypeManager._instance = new DataTypeManager())
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected pool: DataType<any>[] = []

  register() {}
}
