import { suspense } from '@gallop/gallop'

export const lang = (key: string, locale: string = 'zh') =>
  suspense(async () => Reflect.get(await import(`./${locale}.json`), key) ?? key, {
    fallback: () => key,
    depends: []
  })
