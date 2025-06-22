import { BaseValidator } from './BaseValidator.js';
import { FileUtils } from '../utils/FileUtils.js';
import { ValidationSummary } from '../types/index.js';

export class JsonValidator extends BaseValidator {
    constructor(verbose: boolean = false) {
        super(verbose);
    }

    public validateFile(filePath: string): void {
        try {
            FileUtils.readJsonFile(filePath);
            this.debug(`JSON validation passed for ${filePath}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.addError(`Invalid JSON in ${filePath}: ${errorMessage}`, filePath);
        }
    }

    protected generateSummary(): ValidationSummary {
        return {
            totalFiles: this.errors.length + this.warnings.length,
            totalWords: 0,
            errors: this.errors.length,
            warnings: this.warnings.length,
            languages: []
        };
    }
} 