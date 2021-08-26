import { getInfoByNameFromGit } from './utils.js'

export const SCOPE = 'gallop'
export const AUTHOR = getInfoByNameFromGit('user.name')
export const EMAIL = getInfoByNameFromGit('user.email')
export const URL = getInfoByNameFromGit('remote.origin.url')

export const REGISTRY = 'https://registry.npmjs.org/'

/** @type {string[]} */
export const externalDependencies = []

export const packageBlackList = ['doc', 'real']
