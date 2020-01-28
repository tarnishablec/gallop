const execa = require('execa')

const pkg = require('../package.json')

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
    execa.commandSync(
      `yarn add ${depFields[dep].data} ${depFields[dep].tag} -W`,
      {
        stdio: 'inherit'
      }
    )
  }
}

upgrade()
execa.commandSync(`lerna bootstrap`, {
  stdio: 'inherit'
})
