const { run } = require('./utils')
const { cyan } = require('chalk')
const ncu = require('npm-check-updates')
const { _: targets, y, i } = require('minimist')(process.argv.slice(2))

async function upgrade() {
  if (!targets.length) {
    run(`ncu ${y ? '-u' : ''} ${i ? '-i' : ''} -p yarn`)
  } else {
    for (let i = 0; i < targets.length; i++) {
      const target = targets[i]
      await ncu
        .run({
          silent: true,
          upgrade: !!y,
          interactive: true,
          packageManager: 'yarn',
          packageFile: `./packages/${target.split('/').pop()}/package.json`
        })
        .then((res) =>
          console.log(
            cyan(`[${target}] dependencies to upgrade: ${JSON.stringify(res)}`)
          )
        )
    }
  }
  !!y && run(`lerna bootstrap`)
}

upgrade()
