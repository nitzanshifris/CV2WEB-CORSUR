module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
        isolatedModules: true,
        diagnostics: {
          ignoreCodes: [1343],
        },
        astTransformers: {
          before: [
            {
              path: 'node_modules/ts-jest-mock-import-meta',
              options: { metaObjectReplacement: { url: 'https://www.url.com' } },
            },
          ],
        },
      },
    ],
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/__tests__/**',
    '!src/**/__mocks__/**',
    '!src/**/__fixtures__/**',
    '!src/**/__snapshots__/**',
    '!src/**/types.ts',
    '!src/**/index.{js,jsx,ts,tsx}',
    '!src/**/constants.{js,jsx,ts,tsx}',
    '!src/**/styles.{js,jsx,ts,tsx}',
    '!src/**/theme.{js,jsx,ts,tsx}',
    '!src/**/utils.{js,jsx,ts,tsx}',
    '!src/**/config.{js,jsx,ts,tsx}',
    '!src/**/routes.{js,jsx,ts,tsx}',
    '!src/**/store.{js,jsx,ts,tsx}',
    '!src/**/reducers.{js,jsx,ts,tsx}',
    '!src/**/actions.{js,jsx,ts,tsx}',
    '!src/**/selectors.{js,jsx,ts,tsx}',
    '!src/**/middleware.{js,jsx,ts,tsx}',
    '!src/**/sagas.{js,jsx,ts,tsx}',
    '!src/**/epics.{js,jsx,ts,tsx}',
    '!src/**/reducers.{js,jsx,ts,tsx}',
    '!src/**/actions.{js,jsx,ts,tsx}',
    '!src/**/selectors.{js,jsx,ts,tsx}',
    '!src/**/middleware.{js,jsx,ts,tsx}',
    '!src/**/sagas.{js,jsx,ts,tsx}',
    '!src/**/epics.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage/junit',
        outputName: 'junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: true,
      },
    ],
  ],
  verbose: true,
  testTimeout: 10000,
  maxWorkers: '50%',
  maxConcurrency: 1,
  bail: 1,
  cache: true,
  cacheDirectory: '.jest-cache',
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  detectLeaks: true,
  detectOpenHandles: true,
  forceExit: true,
  globals: {
    'ts-jest': {
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: [1343],
      },
    },
  },
  projects: [
    {
      displayName: 'unit',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}'],
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.json',
            isolatedModules: true,
          },
        ],
      },
    },
    {
      displayName: 'integration',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.integration.{js,jsx,ts,tsx}'],
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.json',
            isolatedModules: true,
          },
        ],
      },
    },
    {
      displayName: 'e2e',
      testMatch: ['<rootDir>/src/**/__tests__/**/*.e2e.{js,jsx,ts,tsx}'],
      transform: {
        '^.+\\.(ts|tsx)$': [
          'ts-jest',
          {
            tsconfig: 'tsconfig.json',
            isolatedModules: true,
          },
        ],
      },
    },
  ],
};
