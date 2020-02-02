const { run } = require('./utils')

main()

async function main() {
  await run(`git add .`)
  await run(`git commit`)
  await run(`lerna publish`)
}
