const req = require.context('@doc/language', true, /\.json$/, 'sync')
const importLang: (locale: string) => Record<string, string> = (locale) =>
  req(`./${locale}.json`)

export const lang = (key: string, locale: string = 'zh') => {
  let map: Record<string, string>
  try {
    map = importLang(locale)
  } catch (error) {
    map = importLang('zh')
  }
  return Reflect.get(map, key)
}
