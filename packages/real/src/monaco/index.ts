import * as monaco from 'monaco-editor'

export const dtsLibs: { url?: string; name: string; content?: string }[] = [
  {
    name: '@gallop/gallop',
    url: `https://unpkg.com/@gallop/gallop@latest/dist/index.d.ts`
  },
  {
    name: 'monaco-editor',
    url: `https://unpkg.com/monaco-editor@latest/esm/vs/editor/editor.api.d.ts`
  }
]

let prepared = false
export const prepareMonaco = async () => {
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext
  })

  monaco.languages.typescript.typescriptDefaults.addExtraLib(
    `declare module '*?raw' {
      const content: string
      export default content
    }`
  )

  for (const lib of dtsLibs) {
    const code =
      lib.content ?? (await fetch(lib.url!).then((res) => res.text()))
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `declare module '${lib.name}' { ${code} }`
    )
  }

  prepared = true
}

export const createMonaco = async (
  ...args: Parameters<typeof monaco.editor.create>
) => {
  if (!prepared) await prepareMonaco()
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

  new ResizeObserver((cbs) =>
    cbs.forEach(() => {
      editor.layout()
    })
  ).observe(domElement)

  return editor
}
