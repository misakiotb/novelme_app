const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.next/'
  ]
}

module.exports = createJestConfig(customJestConfig)