// import knova from 'konva'
import { type Psd, type Layer as PsdLayer } from 'ag-psd'
import React from 'react'
import { Stage, Layer, Image, Text, Group } from 'react-konva'
import { type ElementType } from './types'

// useStrictMode(true)

export const KnovaPsdViewer = ({
  psd,
  size
}: {
  psd: Psd
  size?: {
    width: number
    height: number
  }
}) => {
  const ratio = (size?.width ?? 0) / psd.width

  // const [selecetedLayers, setSelectedlayers] = useState<PsdLayer[]>()

  return (
    <Stage width={size?.width} height={size?.height}>
      <Layer>
        {psd.children?.map((child) => {
          const type = resolveLayerType(child)
          const Comp = resolveComponentByType(type)

          const originWidth = (child.right ?? 0) - (child.left ?? 0)
          const originHeight = (child.bottom ?? 0) - (child.top ?? 0)
          return (
            <Comp
              draggable
              psdLayer={child}
              onClick={(e) => {
                console.log(e)
                // const { target } = e
              }}
              key={child.id}
              image={type === 'Image' ? cloneCanvas(child.canvas) : undefined}
              text={child.text?.text}
              width={type === 'Image' ? originWidth * ratio : undefined}
              height={type === 'Image' ? originHeight * ratio : undefined}
              x={(child.left ?? 0) * ratio}
              y={(child.top ?? 0) * ratio}
              onDragStart={console.log}
            />
          )
        })}
      </Layer>
    </Stage>
  )
}

export const KnovaItemViewer = ({
  layer,
  size
}: {
  layer: PsdLayer
  size?: {
    width: number
    height: number
  }
}) => {
  const Comp = resolveComponentByType(resolveLayerType(layer))
  const originSize = getLayerSize(layer)
  size = size ?? originSize

  const wratio = size.width / originSize.width
  const hratio = size.height / originSize.height

  const ratio = wratio ? hratio : hratio

  return (
    <Stage {...size} scaleX={ratio} scaleY={ratio}>
      <Layer>
        <Comp
          draggable
          image={cloneCanvas(layer.canvas)}
          text={layer.text?.text}
          x={0}
          y={0}
        />
      </Layer>
    </Stage>
  )
}

export const getLayerSize = (layer: PsdLayer) => {
  return {
    width: (layer.right ?? 0) - (layer.left ?? 0),
    height: (layer.bottom ?? 0) - (layer.top ?? 0)
  }
}

export const resolveLayerType = (layer: PsdLayer): ElementType => {
  if (layer.children) return 'View'
  if (layer.text) return 'Text'
  return 'Image'
}

export const TypeComponentMap = {
  Image,
  Text,
  View: Group
} as const

export const resolveComponentByType = (type: ElementType) =>
  TypeComponentMap[type]

export const createImageElement = (src?: string) => {
  const image = document.createElement('img')
  src && (image.src = src)
  return image
}

export const cloneCanvas = (canvas?: HTMLCanvasElement) => {
  const newCanvas = document.createElement('canvas')
  if (canvas) {
    newCanvas.width = canvas.width
    newCanvas.height = canvas.height
    newCanvas.getContext('2d')?.drawImage(canvas, 0, 0)
  }
  return newCanvas
}
