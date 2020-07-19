const req = require.context('.', false, /\.json$/, 'sync')

export const lang = (key: string, locale: string = 'zh') => {
  try {
    return Reflect.get(req(`./${locale}.json`), key) ?? key
  } catch (error) {
    return key
  }
}
