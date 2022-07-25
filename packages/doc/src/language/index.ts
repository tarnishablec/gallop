const languages = import.meta.glob<true, string, any>('./*.json', {
  eager: true
})

export const localize = (key: string, locale = 'zh') => {
  return Reflect.get(languages[`./${locale}.json`], key) ?? key
}
