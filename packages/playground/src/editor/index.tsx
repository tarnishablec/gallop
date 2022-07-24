import { Application } from '@gallop/real'

const app = new Application()

app.AddonMananger.loadAddonModule({
  name: '@gallop/addon-test'
})

// @ts-ignore
window.app = app
