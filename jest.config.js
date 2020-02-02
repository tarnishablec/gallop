module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: __dirname,
  testMatch: ['<rootDir>/packages/**/__tests__/**/*.+(test|spec).[jt]s?(x)']
}
