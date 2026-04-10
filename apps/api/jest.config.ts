import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  rootDir: '.',

  testMatch: ['**/*.spec.ts'],

  moduleFileExtensions: ['ts', 'js'],

  clearMocks: true,

  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};

export default config;
