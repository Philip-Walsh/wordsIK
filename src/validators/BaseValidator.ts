import { ValidationResult, ValidationError, ValidationWarning } from '../types';
import chalk from 'chalk';

export abstract class BaseValidator {
    protected errors: ValidationError[] = [];
    protected warnings: ValidationWarning[] = [];
    protected verbose: boolean = false;

    constructor(verbose: boolean = false) {
        this.verbose = verbose;
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

        if (this.verbose) {
            console.error(chalk.red(`❌ ERROR: ${message}`));
            if (file) console.error(chalk.gray(`   File: ${file}`));
            if (context) console.error(chalk.gray(`   Context: ${context}`));
        }
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

        if (this.verbose) {
            console.warn(chalk.yellow(`⚠️  WARNING: ${message}`));
            if (file) console.warn(chalk.gray(`   File: ${file}`));
            if (context) console.warn(chalk.gray(`   Context: ${context}`));
        }
    }

    protected log(message: string): void {
        if (this.verbose) {
            console.log(chalk.blue(`ℹ️  ${message}`));
        }
    }

    public getResult(): ValidationResult {
        return {
            success: this.errors.length === 0,
            errors: [...this.errors],
            warnings: [...this.warnings],
            summary: this.generateSummary()
        };
    }

    protected abstract generateSummary(): any;

    public clear(): void {
        this.errors = [];
        this.warnings = [];
    }
} 