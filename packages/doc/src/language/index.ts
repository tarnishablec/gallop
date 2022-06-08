const languages = import.meta.globEager(`./*.json`)

export const localize = (key: string, locale = 'zh') => {
  return Reflect.get(languages[`./${locale}.json`].default, key) ?? key
}
