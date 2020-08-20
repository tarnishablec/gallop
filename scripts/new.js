const { run, resolveTargets } = require('./utils')
const { scope } = require('./setting')
const args = require('minimist')(process.argv.slice(2))

main()

async function main() {
  const cache = [...args._]
  const noscope = args.noscope
  await createPackages(args._, noscope)
  run(
    `yarn run boot ${resolveTargets(cache).join(' ')} --init --force ${
      noscope ? '--noscope' : ''
    }`
  )
}

async function createPackages(names, noscope = false) {
  if (names.length === 0) {
    return
  } else {
    const fullname = `${noscope ? `@${scope}/` : ''}${names.shift()}`
    run(`lerna create ${fullname} --yes`)
    createPackages(names)
  }
}
