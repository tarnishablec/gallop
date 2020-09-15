const req = require.context('@doc/language', true, /\.json$/, 'sync')
const importLang: (locale: string) => Record<string, string> = (locale) =>
  req(`./${locale}.json`)

export const lang = (key: string, locale: string = 'zh') => {
  let map: Record<string, string>
  let ok: boolean
  try {
    map = importLang(locale)
    ok = true
  } catch (error) {
    map = importLang('zh')
    ok = false
  }
  return (!ok ? key : Reflect.get(map, key)).replace(/-/g, ' ')
}
