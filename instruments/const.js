import { getInfoByNameFromGit } from './utils.js'

export const SCOPE = 'gallop'
export const AUTHOR = getInfoByNameFromGit('user.name')
export const EMAIL = getInfoByNameFromGit('user.email')
export const URL = getInfoByNameFromGit('remote.origin.url')

export const REGISTRY = 'https://registry.npmjs.org/'

export const externalDependencies = [
  'react',
  'react-dom',
  'dayjs',
  'lodash',
  'classnames',
  'axios',
  'styled-components',
  'ali-oss',
  'spark-md5',
  'ahooks'
]

export const packageBlackList = ['share', 'sandbox']
