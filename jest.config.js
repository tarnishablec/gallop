module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: __dirname,
  setupFiles: ['./setupTests.js'],
  testMatch: [
    '<rootDir>/packages/**/__tests__/**/*.+(test|spec).[jt]s?(x)'
  ]
}
