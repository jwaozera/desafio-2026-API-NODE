/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/*.spec.ts', '**/*.test.ts'],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        // desabilita type checking no jest (tsc --noEmit é usado para isso)
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    // redireciona imports do prisma gerado para o mock nos testes
    '^(.*)/generated/prisma$': '<rootDir>/src/__mocks__/generated/prisma',
  },
};
