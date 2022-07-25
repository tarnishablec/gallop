import { type PackageJson } from 'type-fest'
import { intersection } from 'lodash-es'
import urlcat from 'urlcat'
// import path from 'path-browserify'

console.log(import.meta)

export abstract class Addon {
  static assertAddon(target: unknown): asserts target is new () => Addon {
    console.log(target)
    if (!(typeof target === 'function' && target.prototype instanceof this))
      throw new Error('')
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
    esmsh: '//esm.sh'
  } as const

  resolveRemoteSrc?: (
    name: AddonDesc['name'],
    version: AddonDesc['version']
  ) => string

  cdn: keyof AddonMananger['cdns'] = 'esmsh'

  addonList: Addon[] = []

  /** Only save descs */
  addonLibrary: Map<
    Addon['name'],
    { list: AddonDesc[]; actived?: AddonDesc['version']; instance?: Addon }
  > = new Map()

  loadAddonModule = async (addonDesc: AddonDesc) => {
    const { DEV } = import.meta.env
    const srcPrefix =
      this.resolveRemoteSrc?.(addonDesc.name, addonDesc.version) ??
      `${this.cdns[this.cdn]}/${addonDesc.name}@${
        addonDesc.version ?? 'latest'
      }`
    if (!intersection(Object.keys(addonDesc), ['module', 'main']).length) {
      addonDesc = JSON.parse(
        await (
          await fetch(`${srcPrefix}/package.json`, { mode: 'cors' })
        ).text()
      )
    }
    let remoteUrl = srcPrefix
    if (DEV) {
      remoteUrl = urlcat(remoteUrl, {
        alias: `@gallop/real:${import.meta.url}/../../`
      })
    }
    const addonModule = await import(/* @vite-ignore */ remoteUrl)
    if (addonModule) {
      const clazz = addonModule.default
      Addon.assertAddon(clazz)
      const instance = new clazz()
      await instance.onLoaded?.()
      return { instance, addonDesc }
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
