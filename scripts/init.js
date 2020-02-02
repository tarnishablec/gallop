const fse = require('fs-extra')
const path = require('path')
const args = require('minimist')(process.argv.slice(2))
const { run } = require('./utils')

const filesNeedReplace = [
  `./scripts/setting.js`,
  `./package.json`,
  `./tsconfig.json`
]

main()

async function main() {
  await run(`git reset --hard`)

  filesNeedReplace.forEach(f => {
    let filePath = path.resolve(__dirname, '..', f)
    const res = fse
      .readFileSync(filePath, 'utf-8')
      .replace(/~oruo~/g, args.name)
    fse.writeFileSync(filePath, res)
  })

  fse.removeSync(path.resolve(__dirname, '../packages/oruo'))
  const name = require('../package.json').name
  await run(`yarn run new --name ${name}`)
}
