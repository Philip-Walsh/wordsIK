export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': 'ts-jest',
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
        '!src/cli.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
    extensionsToTreatAsEsm: ['.ts'],
    globals: {
        'ts-jest': {
            useESM: true,
        },
    },
    moduleNameMapper: {
        '^../utils/Logger$': '<rootDir>/src/__mocks__/Logger.ts',
        '^./utils/Logger$': '<rootDir>/src/__mocks__/Logger.ts',
        '^src/utils/Logger$': '<rootDir>/src/__mocks__/Logger.ts',
        '^@/utils/Logger$': '<rootDir>/src/__mocks__/Logger.ts',
    },
    automock: false,
    resetMocks: true,
    restoreMocks: true,
    testPathIgnorePatterns: [
        '/node_modules/',
        'src/__tests__/__mocks__/mockLogger.ts'
    ],
}; 