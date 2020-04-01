module.exports = {
  preset: 'ts-jest',
  runner: '@jest-runner/electron',
  testEnvironment: '@jest-runner/electron/environment',
  // testEnvironment: 'jsdom',
  rootDir: __dirname,
  // setupFiles: ['./setupTests.js'],
  testMatch: ['<rootDir>/packages/**/__tests__/**/*.+(test|spec).[jt]s?(x)'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!<rootDir>/packages/{test-example,router}/**',
    '!**/node_modules/**',
    '!**/vendor/**'
  ]
}
