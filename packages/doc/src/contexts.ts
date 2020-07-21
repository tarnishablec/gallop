import { Context, createContext } from '@gallop/gallop'

export const [gloabl] = Context.initGlobal({ locale: 'zh' })

export const [{ menu }, menuContext] = createContext({
  menu: [{ name: 'Essentials', children: ['Overview', 'Installation'] }]
})
