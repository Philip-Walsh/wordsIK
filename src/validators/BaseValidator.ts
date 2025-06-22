import { ValidationResult, ValidationError, ValidationWarning, LogData, ValidationSummary } from '../types/index.js';
import { Logger, LogLevel } from '../utils/Logger.js';

export abstract class BaseValidator {
    protected errors: ValidationError[] = [];
    protected warnings: ValidationWarning[] = [];
    protected logger: Logger;

    constructor(verbose: boolean = false) {
        this.logger = new Logger({
            level: verbose ? LogLevel.DEBUG : LogLevel.INFO,
            verbose
        });
    }

    protected addError(message: string, file?: string, line?: number, column?: number, context?: string): void {
        const error: ValidationError = {
            type: 'error',
            message,
            file,
            line,
            column,
            context
        };
        this.errors.push(error);

        this.logger.error(message, context || file);
    }

    protected addWarning(message: string, file?: string, line?: number, column?: number, context?: string): void {
        const warning: ValidationWarning = {
            type: 'warning',
            message,
            file,
            line,
            column,
            context
        };
        this.warnings.push(warning);

        this.logger.warn(message, context || file);
    }

    protected log(message: string, context?: string): void {
        this.logger.info(message, context);
    }

    protected debug(message: string, context?: string, data?: LogData): void {
        this.logger.debug(message, context, data);
    }

    protected success(message: string, context?: string): void {
        this.logger.success(message, context);
    }

    protected progress(message: string, context?: string): void {
        this.logger.progress(message, context);
    }

    public getResult(): ValidationResult {
        const summary = this.generateSummary();
        return {
            success: this.errors.length === 0,
            errors: [...this.errors],
            warnings: [...this.warnings],
            summary
        };
    }

    protected abstract generateSummary(): ValidationSummary;

    public clear(): void {
        this.errors = [];
        this.warnings = [];
    }

    public close(): void {
        this.logger.close();
    }
} 