const execa = require('execa')
const target = require('minimist')(process.argv.slice(2))._
const { scope } = require('../scripts/setting')

if (Array.isArray(target) && target.length > 1) {
  throw new Error('can only upgrade at most one package')
}

const pkg =
  target.length !== 0
    ? require(`../packages/${target}/package.json`)
    : require('../package.json')

const options = {
  devDependencies: {
    tag: '-D'
  },
  peerDependencies: {
    tag: '-P'
  },
  dependencies: {
    tag: ''
  }
}

const depFields = {}

for (const opt in options) {
  if (pkg[opt]) {
    depFields[opt] = {
      ...options[opt],
      data: Object.keys(pkg[opt]).join(' ')
    }
  }
}

console.log(depFields)

function upgrade() {
  for (const dep in depFields) {
    if (!target.length) {
      execa.commandSync(
        `yarn add ${depFields[dep].data} ${depFields[dep].tag} -W`,
        {
          stdio: 'inherit'
        }
      )
    } else {
      execa.commandSync(
        `yarn workspace @${scope}/${target} add ${depFields[dep].data} ${depFields[dep].tag}`,
        {
          stdio: 'inherit'
        }
      )
    }
  }
}

upgrade()
execa.commandSync(`lerna bootstrap`, {
  stdio: 'inherit'
})
