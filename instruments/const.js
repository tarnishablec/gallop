import { getInfoByNameFromGit } from './utils.js'
import { createRequire } from 'module'

export const SCOPE = String(
  createRequire(import.meta.url)('../package.json').name
)
export const AUTHOR = getInfoByNameFromGit('user.name')
export const EMAIL = getInfoByNameFromGit('user.email')
export const URL = getInfoByNameFromGit('remote.origin.url')

export const REGISTRY = 'https://registry.npmjs.org/'

/** @type {string[]} */
export const externalDependencies = ['@gallop/gallop/directives']

export const packageBlackList = ['doc', 'real']
