import { createContext, ContextOptions } from '@gallop/gallop'
import type json from '@doc/language/zh.json'

type Name = keyof typeof json

export const syncLocalStorage: <T extends Record<string, unknown>>(
  name: string
) => ContextOptions<T> = (name) => {
  const namespace = '$context$'
  return {
    beforeCreate: (context) => {
      if (window.localStorage.getItem(namespace) === null) {
        window.localStorage.setItem(namespace, '{}')
      }
      const temp = JSON.parse(window.localStorage.getItem(namespace)!)
      const t = Reflect.get(temp, name)
      if (t !== void 0) {
        context.raw = t
      } else {
        Reflect.set(temp, name, context.raw)
        window.localStorage.setItem(namespace, JSON.stringify(temp))
      }
    },
    onUpdate: (context) => {
      const temp = JSON.parse(window.localStorage.getItem(namespace)!)
      Reflect.set(temp, name, context.proxy)
      window.localStorage.setItem(namespace, JSON.stringify(temp))
    }
  }
}

export const menuData: { menu: { name: Name; children?: Name[] }[] } = {
  menu: [
    {
      name: 'Introduction',
      children: ['Overview', 'Installation', 'No-Silver-Bullet']
    },
    {
      name: 'Main-Concepts',
      children: [
        'Template',
        'Component',
        'Event',
        'Style',
        'Hooks',
        'Directives',
        'Context'
      ]
    },
    { name: 'Component-In-Depth' }
  ]
}

export const [localeData, localeContext] = createContext(
  {
    locale: 'zh',
    list: ['zh']
  },
  [syncLocalStorage('localeContext')]
)
