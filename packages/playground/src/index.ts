import type { Image, CanvasKit } from 'canvaskit-wasm'

const ckLoaded = CanvasKitInit({
  locateFile: (file) => 'https://unpkg.com/canvaskit-wasm@0.30.0/bin/' + file
})
const cdn = 'https://storage.googleapis.com/skia-cdn/misc/'
const loadTestImage = fetch(cdn + 'test.png').then((response) =>
  response.arrayBuffer()
)

Promise.all([ckLoaded, loadTestImage]).then((results) =>
  MultiCanvasExample(...results)
)

function MultiCanvasExample(CanvasKit: CanvasKit, imgBytes: ArrayBuffer) {
  const paint = new CanvasKit.Paint()

  const surfOne = CanvasKit.MakeWebGLCanvasSurface('api1')!
  // const canvasOne = surfOne.getCanvas()
  const surfTwo = CanvasKit.MakeWebGLCanvasSurface('api2')!
  const canvasTwo = surfTwo.getCanvas()
  const surfThree = CanvasKit.MakeWebGLCanvasSurface('api3')!
  const canvasThree = surfThree.getCanvas()

  // function firstFrame() {
  //   paint.setColor(CanvasKit.Color4f(1, 0, 0, 1)) // red
  //   canvasOne.drawRect(CanvasKit.LTRBRect(0, 0, 300, 300), paint)
  //   surfOne.flush()

  //   paint.setColor(CanvasKit.Color4f(0, 1, 0, 1)) // green
  //   canvasTwo.drawRect(CanvasKit.LTRBRect(0, 0, 300, 300), paint)
  //   surfTwo.flush()

  //   paint.setColor(CanvasKit.Color4f(0, 0, 1, 1)) // blue
  //   canvasThree.drawRect(CanvasKit.LTRBRect(0, 0, 300, 300), paint)
  //   surfThree.flush()

  //   window.requestAnimationFrame(secondFrame)
  // }

  let img: Image
  function secondFrame() {
    img = CanvasKit.MakeImageFromEncoded(imgBytes)!

    // canvasOne.drawImageCubic(img, 0, 0, 0, 0.5, null)
    // surfOne.flush()

    canvasTwo.drawImageCubic(img, 0, 0, 0.3, 0.3, null)
    surfTwo.flush()

    canvasThree.drawImageCubic(img, 0, 0, 1, 1, null)
    surfThree.flush()

    // window.requestAnimationFrame(thirdFrame)
  }

  surfOne.requestAnimationFrame((canvas) => {
    const image = CanvasKit.MakeImageFromEncoded(imgBytes)!
    canvas.drawImageRect(
      image,
      CanvasKit.XYWHRect(0, 0, image.width(), image.height()),
      CanvasKit.XYWHRect(0, 0, surfOne.width(), surfOne.height()),
      paint
    )
  })

  // function thirdFrame() {
  //   canvasOne.drawImageCubic(img, 100, 100, 0.3, 0.3, null)
  //   surfOne.flush()

  //   canvasTwo.drawImageCubic(img, 100, 100, 0.3, 0.3, null)
  //   surfTwo.flush()

  //   canvasThree.drawImageCubic(img, 100, 100, 0.3, 0.3, null)
  //   surfThree.flush()
  // }

  window.requestAnimationFrame(secondFrame)
}
