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
    '<rootDir>/packages/gallop/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!<rootDir>/packages/gallop/src/directives/**',
    '!<rootDir>/packages/{sandbox,doc,router}/**',
    '!<rootDir>/packages/*/dist/**',
    '!<rootDir>/packages/*/index.js',
    '!**/node_modules/**',
    '!**/vendor/**'
  ]
}
