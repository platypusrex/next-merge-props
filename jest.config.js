module.exports = {
  coveragePathIgnorePatterns: ['<rootDir>/test'],
  // testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules', 'dist'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
