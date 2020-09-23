module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsconfigRootDir: 'tsconfig.json',
    }
  },
  setupFilesAfterEnv: ['./jest.setup.ts'],
};
