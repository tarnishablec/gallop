import { type PackageJson } from 'type-fest'
import path from 'path-browserify'

export abstract class Addon {
  static checkisAddon(target: unknown): target is new () => Addon {
    return typeof target === 'function' && target.prototype instanceof this
  }

  abstract name: string

  prepare?: () => unknown

  onLoaded?: () => unknown
  onUnLoaded?: () => unknown
  onActivated?: () => unknown
  onDeActivated?: () => unknown
}

type AddonDesc = PackageJson & { name: Addon['name'] }

export class AddonMananger {
  cdns = {
    jsdelivr: '//cdn.jsdelivr.net/npm',
    unpkg: '//unpkg.com'
  } as const

  resolveRemoteSrc?: (
    name: AddonDesc['name'],
    version: AddonDesc['version']
  ) => string

  cdn: keyof AddonMananger['cdns'] = 'unpkg'

  addonList: Addon[] = []

  /** Only save descs */
  addonLibrary: Map<
    Addon['name'],
    { list: AddonDesc[]; actived?: AddonDesc['version']; instance?: Addon }
  > = new Map()

  loadAddonModule = async (addonDesc: AddonDesc) => {
    const srcPrefix =
      this.resolveRemoteSrc?.(addonDesc.name, addonDesc.version) ??
      `${this.cdns[this.cdn]}/${addonDesc.name}@${
        addonDesc.version ?? 'latest'
      }`
    if (Object.keys(addonDesc).length < 4) {
      addonDesc = JSON.parse(
        await (await fetch(`${srcPrefix}/package.json`)).text()
      )
    }
    const { main, module } = addonDesc
    const moduleUrl = '/' + path.resolve(srcPrefix, module ?? main!)
    const addonModule = await import(/* @vite-ignore */ moduleUrl)
    // const addonModule = await import(/* @vite-ignore */ `@gallop/addon-test`)
    if (addonModule) {
      const clazz = addonModule.default
      if (Addon.checkisAddon(clazz)) {
        const instance = new clazz()
        await instance.onLoaded?.()
        return { instance, addonDesc }
      }
    }
    return { addonDesc }
  }

  activateAddon = async (option: Pick<AddonDesc, 'name' | 'version'>) => {
    const addonEntry = this.addonLibrary.get(option.name)!
    const { addonDesc, instance } = await this.loadAddonModule(option)
    addonEntry.actived = addonDesc.version
    addonEntry.instance = instance
  }

  deActivateAddon = async (option: Pick<AddonDesc, 'name'>) => {}

  private constructor() {}
  private static instance: AddonMananger
  static getInstance = () => {
    let instance = AddonMananger.instance
    if (!instance) {
      instance = AddonMananger.instance = new AddonMananger()
    }
    return instance
  }
}
