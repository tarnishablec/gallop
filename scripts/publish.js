const execa = require('execa')
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })

main()

async function main() {
  await run(`git add .`)
  await run(`git commit`)
  await run(`lerna publish --contents src`)
}
