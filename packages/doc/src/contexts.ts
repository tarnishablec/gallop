import { createContext, ContextOptions } from '@gallop/gallop'
import type json from './language/zh.json'

export type Name = keyof typeof json

export const syncLocalStorage: <T extends Record<string, unknown>>(
  name: string
) => ContextOptions<T> = (name) => {
  const namespace = '$context$'
  return {
    beforeCreate() {
      if (window.localStorage.getItem(namespace) === null) {
        window.localStorage.setItem(namespace, '{}')
      }
      const temp = JSON.parse(window.localStorage.getItem(namespace)!)
      const t = Reflect.get(temp, name)
      if (t !== void 0) {
        this.raw = t
      } else {
        Reflect.set(temp, name, this.raw)
        window.localStorage.setItem(namespace, JSON.stringify(temp))
      }
    },
    onUpdate() {
      const temp = JSON.parse(window.localStorage.getItem(namespace)!)
      Reflect.set(temp, name, this.data)
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
      children: ['Template', 'Part', 'Component', 'Event', 'Style']
    },
    {
      name: 'Component-In-Depth',
      children: [
        'Component-Registration',
        'Component-Update',
        'Component-Lifecycle',
        'Access-Dom'
      ]
    },
    {
      name: 'Extensibility',
      children: [
        'Hooks',
        'Directives',
        'Template-Customization',
        'Custom-Syntax'
      ]
    },
    { name: 'State-Management', children: ['Context', 'Context-Lifecycle'] },
    { name: 'Cross-Frameworks', children: ['With-React'] },
    { name: 'Some-Thougth' }
  ]
}

export const localeContext = createContext(
  {
    locale: 'zh',
    list: ['zh', 'en']
  }
  // [syncLocalStorage('localeContext')]
)
