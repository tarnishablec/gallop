import * as monaco from 'monaco-editor'
import cssFormatMonaco from 'css-format-monaco'

export const dtsLibs: { url?: string; name: string; content?: string }[] = [
  {
    name: '@gallop/gallop',
    url: `https://unpkg.com/@gallop/gallop@latest/dist/index.d.ts`
  },
  {
    name: 'monaco-editor',
    url: `https://unpkg.com/monaco-editor@latest/esm/vs/editor/editor.api.d.ts`
  },
  {
    name: 'css-format-monaco',
    url: `https://raw.githubusercontent.com/troy351/css-format-monaco/master/index.d.ts`
  }
]

export const prepareMonaco = async () => {
  // enable css format
  cssFormatMonaco(monaco, {
    indent_size: 2
  })

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext
  })

  dtsLibs.forEach((v) =>
    v.url && !v.content
      ? fetch(v.url).then(async (res) => {
          v.content = await res.text()
          monaco.languages.typescript.typescriptDefaults.addExtraLib(
            `declare module '${v.name}' { ${v.content} }`
          )
        })
      : undefined
  )
}

prepareMonaco()

export const createMonaco = async (
  ...args: Parameters<typeof monaco.editor.create>
) => {
  const [domElement, options] = args
  const editor = monaco.editor.create(domElement, {
    language: 'typescript',
    theme: 'vs-dark',
    useShadowDOM: true,
    smoothScrolling: true,
    fontSize: 14,
    tabSize: 2,
    ...options
  })

  domElement.style.overflow = 'hidden'

  new ResizeObserver((cbs) => cbs.forEach(() => editor.layout())).observe(
    domElement
  )

  return editor
}
