import { readPsd } from 'ag-psd'
import React, { useCallback, useLayoutEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { useRequest, useSize } from 'ahooks'
import { Spinner, ChakraProvider } from '@chakra-ui/react'
import styled from 'styled-components'
import { useDropzone, type DropzoneState } from 'react-dropzone'
import { KnovaItemViewer, KnovaPsdViewer } from './knova'

import './index.scss'

const App = () => {
  const appRef = useRef<HTMLDivElement>(null)
  const fullPreviewRef = useRef<HTMLDivElement>(null)
  const knovaPreviewRef = useRef<HTMLDivElement>(null)

  const {
    data: psdData,
    loading,
    runAsync
  } = useRequest(
    async ({ file }: { file: File }) => {
      const psdResult = readPsd(await file.arrayBuffer(), {
        logMissingFeatures: true,
        logDevFeatures: true
        // useImageData: true
      })

      const imgUrl = psdResult.canvas?.toDataURL()

      console.log('[PSD] ', psdResult)

      return { psd: psdResult, imgUrl }
    },
    { refreshDeps: [], manual: true }
  )

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const [psdFile] = acceptedFiles
    await runAsync({ file: psdFile })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/vnd.adobe.photoshop': ['.psd']
    }
  })

  useLayoutEffect(() => {}, [loading])

  const previewImageRef = useRef<HTMLImageElement>(null)

  const size = useSize(previewImageRef)

  return (
    <ChakraProvider>
      <AppWrapper ref={appRef}>
        <UploadWrapper {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps({ accept: '.psd' })} />
          <p>选择PSD文件</p>
        </UploadWrapper>
        <PreviewWrapper ref={fullPreviewRef} gridArea="full">
          {loading ? (
            <Spinner />
          ) : psdData?.imgUrl ? (
            <img ref={previewImageRef} src={psdData?.imgUrl} style={{}} />
          ) : null}
        </PreviewWrapper>
        <PreviewWrapper ref={knovaPreviewRef} gridArea="knova">
          {loading ? (
            <Spinner />
          ) : psdData?.psd ? (
            <KnovaPsdViewer psd={psdData.psd} size={size} />
          ) : null}
        </PreviewWrapper>
        <ItemsWrapper>
          {loading ? (
            <Spinner />
          ) : (
            psdData?.psd.children?.map((layer) => (
              <KnovaItemViewer
                key={layer.id}
                layer={layer}
                size={{ width: 280, height: 280 }}
              />
            ))
          )}
        </ItemsWrapper>
      </AppWrapper>
    </ChakraProvider>
  )
}

type ColorState = Partial<
  Pick<
    DropzoneState,
    'isDragActive' | 'isDragAccept' | 'isDragReject' | 'isFocused'
  >
>

const getColor = (props: ColorState) => {
  if (props.isDragAccept) {
    return '#00e676'
  }
  if (props.isDragReject) {
    return '#ff1744'
  }
  if (props.isFocused) {
    return '#2196f3'
  }
  return '#eeeeee'
}

const UploadWrapper = styled.div<ColorState>`
  grid-area: upload;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  height: min-content;
`

const AppWrapper = styled.div`
  height: 100%;
  width: 100%;
  overflow-y: auto;
  display: grid;
  padding: 20px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr 300px;
  grid-template-areas:
    'upload upload'
    'full knova'
    'items items';
  column-gap: 20px;
  row-gap: 20px;
  background: #c9c6c6a9;
`

const ItemsWrapper = styled.div`
  grid-area: items;
  outline: 1px solid grey;
  grid-auto-flow: column;
  overflow-x: auto;
  overflow-y: hidden;
  place-items: center;
  display: grid;
  column-gap: 5px;
  padding: 5px;

  canvas {
    width: 280px;
    height: 280px;
  }
`

const PreviewWrapper = styled.div<{ gridArea: string }>`
  grid-area: ${({ gridArea }) => gridArea};
  display: flex;
  place-content: center;
  place-items: center;
  outline: 1px solid grey;
  height: 100%;
  width: 100%;
  overflow: hidden;

  & > img {
    object-fit: scale-down;
    max-height: 100%;
    max-width: 100%;
  }
`

const root = createRoot(document.querySelector('#root')!)
root.render(<App />)
