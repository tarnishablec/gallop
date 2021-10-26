import Yoga from 'yoga-layout-wasm'
import yogaWasm from 'yoga-layout-wasm/dist/yoga.wasm?url'
// import {} from 'stretch-layout'

import './index.scss'

const cdn = 'https://storage.googleapis.com/skia-cdn/misc/'
const imgBytes = await fetch(cdn + 'test.png').then((response) =>
  response.arrayBuffer()
)

const CK = await CanvasKitInit({
  locateFile: (file) => 'https://unpkg.com/canvaskit-wasm@0.30.0/bin/' + file
})

const image = CK.MakeImageFromEncoded(imgBytes)!

Yoga.init(yogaWasm).then((yoga) => {
  const Node = yoga.Node
  const root = Node.create()
  root.setWidth(500)
  root.setHeight(600)
  // root.setDisplay(yoga.DISPLAY_FLEX)
  // root.setJustifyContent(yoga.FLEX_DIRECTION_COLUMN)
  // root.setJustifyContent(yoga.JUSTIFY_FLEX_START)

  const level1 = Node.create()
  // level1.setHeightPercent(50)
  level1.setHeightAuto()
  level1.setDisplay(yoga.DISPLAY_FLEX)
  level1.setFlexDirection(yoga.FLEX_DIRECTION_ROW)
  level1.setJustifyContent(yoga.JUSTIFY_SPACE_BETWEEN)

  const level2 = Node.create()
  // level2.setHeightPercent(50)
  // level2.setHeightAuto()
  level2.setHeight(150)
  level2.setWidthPercent(80)
  // level2.set
  level2.setDisplay(yoga.DISPLAY_FLEX)
  level2.setAlignItems(yoga.ALIGN_CENTER)
  level2.setFlexDirection(yoga.FLEX_DIRECTION_ROW)
  level2.setJustifyContent(yoga.JUSTIFY_SPACE_BETWEEN)

  const node1 = Node.create()
  node1.setWidth(100)
  node1.setHeight(100)

  const node2 = Node.create()
  node2.setWidth(100)
  node2.setHeight(140)

  const node3 = Node.create()
  node3.setWidth(100)
  node3.setHeight(80)

  const node4 = Node.create()
  node4.setWidth(100)
  node4.setHeight(100)

  const node5 = Node.create()
  node5.setWidth(100)
  node5.setHeight(100)

  const node6 = Node.create()
  node6.setWidth(100)
  node6.setHeight(100)

  root.insertChild(level1, 0)
  root.insertChild(level2, 1)

  level1.insertChild(node1, 0)
  level1.insertChild(node2, 1)
  level1.insertChild(node3, 2)

  level2.insertChild(node4, 0)
  level2.insertChild(node5, 1)
  level2.insertChild(node6, 2)

  root.calculateLayout(500, 600, yoga.DIRECTION_LTR)

  const surfYoga = CK.MakeWebGLCanvasSurface('yoga')!

  const rootLayout = root.getComputedLayout()
  const level1Layout = level1.getComputedLayout()
  const leve21Layout = level2.getComputedLayout()
  const node1Layout = node1.getComputedLayout()
  const node2Layout = node2.getComputedLayout()
  const node3Layout = node3.getComputedLayout()
  const node4Layout = node4.getComputedLayout()
  const node5Layout = node5.getComputedLayout()
  const node6Layout = node6.getComputedLayout()

  console.log(node4.getComputedTop())

  surfYoga.requestAnimationFrame((canvas) => {
    const paint = new CK.Paint()
    paint.setColor(CK.Color(30, 114, 115, 1))
    canvas.drawRect(
      CK.XYWHRect(
        rootLayout.left,
        rootLayout.top,
        rootLayout.width,
        rootLayout.height
      ),
      paint
    )
    paint.setColor(CK.Color(10, 14, 115, 1))
    canvas.drawRect(
      CK.XYWHRect(
        level1Layout.left,
        level1Layout.top,
        level1Layout.width,
        level1Layout.height
      ),
      paint
    )
    paint.setColor(CK.Color(110, 14, 15, 1))
    canvas.drawRect(
      CK.XYWHRect(
        leve21Layout.left,
        leve21Layout.top,
        leve21Layout.width,
        leve21Layout.height
      ),
      paint
    )
    paint.setColor(CK.Color(130, 14, 15, 1))
    canvas.drawRect(
      CK.XYWHRect(
        node1Layout.left + level1.getComputedLayout().left,
        node1Layout.top + level1.getComputedLayout().top,
        node1Layout.width,
        node1Layout.height
      ),
      paint
    )
    paint.setColor(CK.Color(130, 14, 15, 1))
    canvas.drawRect(
      CK.XYWHRect(
        node2Layout.left + level1.getComputedLayout().left,
        node2Layout.top + level1.getComputedLayout().top,
        node2Layout.width,
        node2Layout.height
      ),
      paint
    )
    paint.setColor(CK.Color(130, 14, 15, 1))
    canvas.drawRect(
      CK.XYWHRect(
        node3Layout.left + level1.getComputedLayout().left,
        node3Layout.top + level1.getComputedLayout().top,
        node3Layout.width,
        node3Layout.height
      ),
      paint
    )

    paint.setColor(CK.Color(30, 24, 15, 1))
    canvas.drawRect(
      CK.XYWHRect(
        node4Layout.left + level2.getComputedLayout().left,
        node4Layout.top + level2.getComputedLayout().top,
        node4Layout.width,
        node4Layout.height
      ),
      paint
    )
    // paint.setColor(CK.Color(130, 14, 15, 1))
    canvas.drawRect(
      CK.XYWHRect(
        node5Layout.left + level2.getComputedLayout().left,
        node5Layout.top + level2.getComputedLayout().top,
        node5Layout.width,
        node5Layout.height
      ),
      paint
    )
    // paint.setColor(CK.Color(130, 14, 15, 1))
    canvas.drawRect(
      CK.XYWHRect(
        node6Layout.left + level2.getComputedLayout().left,
        node6Layout.top + level2.getComputedLayout().top,
        node6Layout.width,
        node6Layout.height
      ),
      paint
    )
  })
})

const paint = new CK.Paint()

const surfOne = CK.MakeWebGLCanvasSurface('api1')!
const surfTwo = CK.MakeWebGLCanvasSurface('api2')!
const canvasTwo = surfTwo.getCanvas()
const surfThree = CK.MakeWebGLCanvasSurface('api3')!
const canvasThree = surfThree.getCanvas()

function secondFrame() {
  const img = CK.MakeImageFromEncoded(imgBytes)!

  canvasTwo.drawImageCubic(img, 0, 0, 0.3, 0.3, null)
  surfTwo.flush()

  canvasThree.drawImageCubic(img, 0, 0, 1, 1, null)
  surfThree.flush()

  // window.requestAnimationFrame(thirdFrame)
}

window.requestAnimationFrame(secondFrame)

surfOne.requestAnimationFrame((canvas) => {
  canvas.drawImageRect(
    image,
    CK.XYWHRect(0, 0, image.width(), image.height()),
    CK.XYWHRect(0, 0, surfOne.width(), surfOne.height()),
    paint
  )
  paint.setColor(CK.Color(0, 255, 255, 1))
  canvas.drawCircle(50, 50, 50, paint)
  canvas.drawText('asdasdas', 100, 100, new CK.Paint(), new CK.Font())
})
