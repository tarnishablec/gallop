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
import { attachComponent, Entity } from './core/Entity'
import { AddOnManager } from './addon'
import { EntityManager } from './core/Entity/EntityManager'
import { SelectorToDraft } from '@real/utils/type'
import { ReactiveSystem } from '@real/core/System/ReactiveSystem'

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
  this.properties[1].meta.unit
})
entity.do(attachComponent, transform2D)

console.log(entity)

console.log(AddOnManager.instance)

class Rotation2D extends Component {
  properties = <const>[
    new Property('location', new UnitData(VECTOR2_TYPE, [4, 4]))
  ]
  constructor() {
    super()
  }
}

EntityManager.instance.getEntities([Transform2D, Rotation2D] as const)

// type A = ComponentDraft<Transform2D>

class RenderSystem extends ReactiveSystem {
  public selector = <const>[Transform2D]
  public process(drafts: SelectorToDraft<this['selector']>): void {
    const [transform] = drafts
    transform.rotation.meta.unit
  }
}

// console.log(transform2D.do(draftlize))

// type A = PropertiesToRecord<Transform2D['properties']>

// type P = Transform2D['properties']

// type R<T> = T extends readonly [infer I, ...infer R] ? R : never
// type I<T> = T extends readonly [infer I, ...infer R] ? I : never

// type RR = R<P>

// type RRR = PropertyToRecord<I<RR>>

// type B = ComponentDraft<Transform2D>

console.log(new RenderSystem() instanceof ReactiveSystem)
