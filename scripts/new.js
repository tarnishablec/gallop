const { run } = require('./utils')
const args = require('minimist')(process.argv.slice(2))

main()

async function main() {
  console.log(args._[0])
  await createPackages(args._)
  await run(`yarn run boot --init --force`)
}

async function createPackages(names) {
  if (names.length === 0) {
    return
  } else {
    await run(`lerna create @oruo/${names.shift()} ${args.yes ? '--yes' : ''}`)
    await createPackages(names)
  }
}
