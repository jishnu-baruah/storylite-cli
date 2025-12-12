module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {
            tsconfig: {
                module: 'commonjs'
            }
        }],
    },
    transformIgnorePatterns: [
        'node_modules/(?!(conf|chalk|ora)/)'
    ],
    moduleNameMapper: {
        '^chalk$': '<rootDir>/src/lib/__tests__/__mocks__/chalk.js',
        '^conf$': '<rootDir>/src/lib/__tests__/__mocks__/conf.js',
        '^ora$': '<rootDir>/src/lib/__tests__/__mocks__/ora.js',
        '^(\\.{1,2}/.*)\\.js$': '$1',
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/**/*.d.ts',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
};