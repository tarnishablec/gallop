export class AddOnManager {
  protected constructor() {}

  private static _instance: AddOnManager

  static get instance() {
    return (
      AddOnManager._instance ?? (AddOnManager._instance = new AddOnManager())
    )
  }

  public addOnList: AddOn[] = []
}

export class AddOn {}
