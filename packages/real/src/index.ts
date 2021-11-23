import { html, render } from '@gallop/gallop'
import './index.scss'
import './registry'
// import { createMonaco } from '@real/monaco'
// import code from './monaco?raw'
// import style from './index.scss?inline'

// import prettier from 'https://unpkg.com/prettier@2.3.2/esm/standalone.mjs'

// createMonaco(document.querySelector('#root #ed1')!, { value: code })

// createMonaco(document.querySelector('#root #ed2')!, {
//   value: style,
//   language: 'scss'
// })

render(html`<re-editor></re-editor>`, {
  container: document.querySelector('#root')!
})

import { Component } from './core/Component'
import { Property } from './core/Property'
import { VECTOR2_TYPE, NUMBER_TYPE } from './core/DataType'
import { UnitData } from './core/UnitData'
import { Entity } from './core/Entity'
import { AddOnManager } from './addon'
import { EntityManager } from './core/Entity/EntityManager'
import type { ComponentKey } from '@real/utils/type'
class Transform2D extends Component {
  override properties = [
    new Property('location', new UnitData(VECTOR2_TYPE, [4, 4])),
    new Property('rotation', new UnitData(NUMBER_TYPE), { unit: 'deg' })
  ] as const
}

const entity = new Entity()
entity.do(function () {})
const transform2D = new Transform2D()
transform2D.do(function (this) {
  this.properties[0].data
})
entity.attachComponent(transform2D)

console.log(entity)

console.log(AddOnManager.instance)

class Rotation2D extends Component {
  override properties = [
    // new Property('')
  ] as const
  constructor() {
    super()
  }
}

EntityManager.instance.getEntities(<const>[Transform2D, Rotation2D])

type A = ComponentKey<Transform2D>

{
  /* type B = ComponentsDraft<Transform2D> */
}
