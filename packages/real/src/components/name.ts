import { Component } from '@real/core/Component'
import { STRING_TYPE } from '@real/core/DataType'
import { Property } from '@real/core/Property'
import { UnitData } from '@real/core/UnitData'

export class NameComponent extends Component {
  override properties = [
    new Property('name', new UnitData(STRING_TYPE))
  ] as const
}
