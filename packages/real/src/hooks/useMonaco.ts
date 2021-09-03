import { useEffect, useStyle } from '@gallop/gallop'
import { createMonaco } from '@real/monaco'
import monacoStyle from 'monaco-editor/min/vs/editor/editor.main.css?inline'

export const useMonaco = ({
  container,
  options
}: {
  container: () => HTMLElement
  options?: Parameters<typeof createMonaco>[1]
}) => {
  useStyle(() => monacoStyle, [])
  useEffect(() => {
    const root = container()
    createMonaco(root, options)
  }, [])
}
