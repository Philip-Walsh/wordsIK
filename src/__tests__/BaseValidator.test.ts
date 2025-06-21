import { mockLogger, resetMockLogger } from './__mocks__/mockLogger';

// Mock the Logger module before importing BaseValidator
jest.mock('../utils/Logger', () => ({
    Logger: jest.fn().mockImplementation(() => mockLogger),
    LogLevel: {
        ERROR: 0,
        WARN: 1,
        INFO: 2,
        DEBUG: 3,
        VERBOSE: 4
    }
}));

import { BaseValidator } from '../validators/BaseValidator';
import { LogData } from '../types';

// Create a concrete implementation of BaseValidator for testing
class TestValidator extends BaseValidator {
    public testAddError(message: string, file?: string, line?: number, column?: number, context?: string): void {
        this.addError(message, file, line, column, context);
    }

    public testAddWarning(message: string, file?: string, line?: number, column?: number, context?: string): void {
        this.addWarning(message, file, line, column, context);
    }

    public testLog(message: string, context?: string): void {
        this.log(message, context);
    }

    public testDebug(message: string, context?: string, data?: LogData): void {
        this.debug(message, context, data);
    }

    public testSuccess(message: string, context?: string): void {
        this.success(message, context);
    }

    public testProgress(message: string, context?: string): void {
        this.progress(message, context);
    }

    protected generateSummary(): { totalFiles: number; totalWords: number; errors: number; warnings: number; languages: string[] } {
        return {
            totalFiles: this.errors.length + this.warnings.length,
            totalWords: 0,
            errors: this.errors.length,
            warnings: this.warnings.length,
            languages: []
        };
    }
}

describe('BaseValidator', () => {
    let validator: TestValidator;

    beforeEach(() => {
        jest.clearAllMocks();
        resetMockLogger();
        validator = new TestValidator(false);
    });

    afterEach(() => {
        try {
            validator.close();
        } catch {
            // Ignore close errors for now
        }
    });

    describe('basic functionality', () => {
        it('should create validator instance', () => {
            expect(validator).toBeDefined();
        });

        it('should return empty result initially', () => {
            const result = validator.getResult();
            expect(result.success).toBe(true);
            expect(result.errors).toEqual([]);
            expect(result.warnings).toEqual([]);
        });
    });

    describe('addError', () => {
        it('should add error with basic message', () => {
            validator.testAddError('Test error message');

            const result = validator.getResult();
            expect(result.success).toBe(false);
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0]).toEqual({
                type: 'error',
                message: 'Test error message',
                file: undefined,
                line: undefined,
                column: undefined,
                context: undefined
            });
        });

        it('should add error with all parameters', () => {
            validator.testAddError('Test error', 'test.json', 5, 10, 'test context');

            const result = validator.getResult();
            expect(result.errors).toHaveLength(1);
            expect(result.errors[0]).toEqual({
                type: 'error',
                message: 'Test error',
                file: 'test.json',
                line: 5,
                column: 10,
                context: 'test context'
            });
        });

        it('should call logger.error when adding error', () => {
            validator.testAddError('Test error', 'test.json');

            expect(mockLogger.error).toHaveBeenCalledWith('Test error', 'test.json');
        });
    });

    describe('addWarning', () => {
        it('should add warning with basic message', () => {
            validator.testAddWarning('Test warning message');

            const result = validator.getResult();
            expect(result.success).toBe(true); // Warnings don't affect success
            expect(result.warnings).toHaveLength(1);
            expect(result.warnings[0]).toEqual({
                type: 'warning',
                message: 'Test warning message',
                file: undefined,
                line: undefined,
                column: undefined,
                context: undefined
            });
        });

        it('should add warning with all parameters', () => {
            validator.testAddWarning('Test warning', 'test.json', 5, 10, 'test context');

            const result = validator.getResult();
            expect(result.warnings).toHaveLength(1);
            expect(result.warnings[0]).toEqual({
                type: 'warning',
                message: 'Test warning',
                file: 'test.json',
                line: 5,
                column: 10,
                context: 'test context'
            });
        });

        it('should call logger.warn when adding warning', () => {
            validator.testAddWarning('Test warning', 'test.json');

            expect(mockLogger.warn).toHaveBeenCalledWith('Test warning', 'test.json');
        });
    });

    describe('logging methods', () => {
        it('should call log method', () => {
            validator.testLog('Test log message', 'test context');

            expect(mockLogger.info).toHaveBeenCalledWith('Test log message', 'test context');
        });

        it('should call debug method', () => {
            const testData = { key: 'value' };
            validator.testDebug('Test debug message', 'test context', testData);

            expect(mockLogger.debug).toHaveBeenCalledWith('Test debug message', 'test context', testData);
        });

        it('should call success method', () => {
            validator.testSuccess('Test success message', 'test context');

            expect(mockLogger.success).toHaveBeenCalledWith('Test success message', 'test context');
        });

        it('should call progress method', () => {
            validator.testProgress('Test progress message', 'test context');

            expect(mockLogger.progress).toHaveBeenCalledWith('Test progress message', 'test context');
        });
    });

    describe('close', () => {
        it('should close logger', () => {
            validator.close();

            expect(mockLogger.close).toHaveBeenCalled();
        });
    });

    describe('clear', () => {
        it('should clear errors and warnings', () => {
            validator.testAddError('Test error');
            validator.testAddWarning('Test warning');

            expect(validator.getResult().errors).toHaveLength(1);
            expect(validator.getResult().warnings).toHaveLength(1);

            validator.clear();

            const result = validator.getResult();
            expect(result.errors).toHaveLength(0);
            expect(result.warnings).toHaveLength(0);
            expect(result.success).toBe(true);
        });
    });

    describe('getResult', () => {
        it('should return correct summary with errors and warnings', () => {
            validator.testAddError('Error 1');
            validator.testAddError('Error 2');
            validator.testAddWarning('Warning 1');

            const result = validator.getResult();
            expect(result.success).toBe(false);
            expect(result.errors).toHaveLength(2);
            expect(result.warnings).toHaveLength(1);
            expect(result.summary.errors).toBe(2);
            expect(result.summary.warnings).toBe(1);
        });

        it('should return success true when no errors', () => {
            validator.testAddWarning('Warning only');

            const result = validator.getResult();
            expect(result.success).toBe(true);
        });
    });
}); 
