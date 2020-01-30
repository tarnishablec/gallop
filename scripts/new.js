const { run, targets } = require('./utils')
const args = require('minimist')(process.argv.slice(2))

main()

async function main() {
  const cache = [...args._]
  await createPackages(args._)
  await run(`yarn run boot ${targets(cache).join(' ')} --init --force`)
}

async function createPackages(names) {
  if (names.length === 0) {
    return
  } else {
    await run(`lerna create @oruo/${names.shift()} --yes`)
    await createPackages(names)
  }
}
