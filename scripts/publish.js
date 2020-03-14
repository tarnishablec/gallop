const { run } = require('./utils')

main()

async function main() {
  await run(`git add .`)
  try {
    await run(`git commit`)
  } catch (error) {}
  await run(`lerna publish`)
}
