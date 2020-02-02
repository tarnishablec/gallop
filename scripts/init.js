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
    const res = fse.readFileSync(filePath, 'utf-8').replace(`~oruo~`, args.name)
    fse.writeFileSync(filePath, res)
  })
}
