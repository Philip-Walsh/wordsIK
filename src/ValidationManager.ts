import { ValidationResult, CLIOptions, SupportedLanguage } from './types';
import { TranslationValidator } from './validators/TranslationValidator';
import { ContentValidator } from './validators/ContentValidator';
import { LanguageValidator } from './validators/LanguageValidator';
import { JsonValidator } from './validators/JsonValidator';
import { FileUtils } from './utils/FileUtils';

export class ValidationManager {
    private options: CLIOptions;

    constructor(options: CLIOptions) {
        this.options = options;
    }

    public async runValidation(): Promise<ValidationResult> {
        const results: ValidationResult[] = [];

        if (this.options.all || (!this.options.json && !this.options.content && !this.options.translations && !this.options.languages)) {
            results.push(await this.validateJson());
            results.push(await this.validateContent());
            results.push(await this.validateTranslations());
            results.push(await this.validateLanguages());
        } else {
            if (this.options.json) {
                results.push(await this.validateJson());
            }
            if (this.options.content) {
                results.push(await this.validateContent());
            }
            if (this.options.translations) {
                results.push(await this.validateTranslations());
            }
            if (this.options.languages) {
                results.push(await this.validateLanguages());
            }
        }

        return this.mergeResults(results);
    }

    private async validateJson(): Promise<ValidationResult> {
        const validator = new JsonValidator(this.options.verbose);
        const files = this.getFilesToValidate();

        for (const file of files) {
            validator.validateFile(file);
        }

        return validator.getResult();
    }

    private async validateContent(): Promise<ValidationResult> {
        const validator = new ContentValidator(this.options.verbose);
        const files = this.getFilesToValidate();

        for (const file of files) {
            validator.validateFile(file);
        }

        return validator.getResult();
    }

    private async validateTranslations(): Promise<ValidationResult> {
        const validator = new TranslationValidator(this.options.verbose);
        const changedFiles = this.options.files || FileUtils.getChangedFiles();

        if (changedFiles.length === 0) {
            return {
                success: true,
                errors: [],
                warnings: [],
                summary: { totalFiles: 0, totalWords: 0, errors: 0, warnings: 0, languages: [] }
            };
        }

        const comparisons = validator.validateChanges(changedFiles);
        return validator.getResult();
    }

    private async validateLanguages(): Promise<ValidationResult> {
        const validator = new LanguageValidator(this.options.verbose);
        validator.validateAllLanguages();
        return validator.getResult();
    }

    private getFilesToValidate(): string[] {
        if (this.options.files && this.options.files.length > 0) {
            return this.options.files;
        }

        return FileUtils.findJsonFiles('data/**/*.json');
    }

    private mergeResults(results: ValidationResult[]): ValidationResult {
        const merged: ValidationResult = {
            success: true,
            errors: [],
            warnings: [],
            summary: {
                totalFiles: 0,
                totalWords: 0,
                errors: 0,
                warnings: 0,
                languages: []
            }
        };

        for (const result of results) {
            merged.success = merged.success && result.success;
            merged.errors.push(...result.errors);
            merged.warnings.push(...result.warnings);

            if (result.summary) {
                merged.summary.totalFiles += result.summary.totalFiles || 0;
                merged.summary.totalWords += result.summary.totalWords || 0;
                merged.summary.errors += result.summary.errors || 0;
                merged.summary.warnings += result.summary.warnings || 0;
            }
        }

        return merged;
    }

    public async generateTranslationTemplate(englishFile: string, targetLanguage: string): Promise<any> {
        throw new Error('Template generation not yet implemented');
    }
} 