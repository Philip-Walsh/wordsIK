import { ValidationResult, CLIOptions, TemplateData, ValidationData, WordData } from './types/index.js';
import { TranslationValidator } from './validators/TranslationValidator.js';
import { ContentValidator } from './validators/ContentValidator.js';
import { LanguageValidator } from './validators/LanguageValidator.js';
import { JsonValidator } from './validators/JsonValidator.js';
import { FileUtils } from './utils/FileUtils.js';
import { Logger, LogLevel } from './utils/Logger.js';
import { readFileSync } from 'fs';

export class ValidationManager {
    private options: CLIOptions;
    private logger: Logger;

    constructor(options: CLIOptions) {
        this.options = options;
        this.logger = new Logger({
            level: options.verbose ? LogLevel.DEBUG : LogLevel.INFO,
            verbose: options.verbose
        });
    }

    public async runValidation(): Promise<ValidationResult> {
        const results: ValidationResult[] = [];

        this.logger.info('Starting validation process', 'ValidationManager');

        if (this.options.all || (!this.options.json && !this.options.content && !this.options.translations && !this.options.languages)) {
            this.logger.info('Running all validations', 'ValidationManager');
            results.push(await this.validateJson());
            results.push(await this.validateContent());
            results.push(await this.validateTranslations());
            results.push(await this.validateLanguages());
        } else {
            this.logger.info('Running specific validations', 'ValidationManager', {
                json: this.options.json,
                content: this.options.content,
                translations: this.options.translations,
                languages: this.options.languages
            });

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

        const mergedResult = this.mergeResults(results);

        this.logger.info('Validation process completed', 'ValidationManager', {
            success: mergedResult.success,
            errors: mergedResult.errors.length,
            warnings: mergedResult.warnings.length
        });

        return mergedResult;
    }

    private async validateJson(): Promise<ValidationResult> {
        this.logger.subsection('JSON Validation');
        this.logger.progress('Starting JSON validation', 'ValidationManager');

        const validator = new JsonValidator(this.options.verbose);
        const files = await this.getFilesToValidate();

        this.logger.info(`Validating ${files.length} JSON files`, 'ValidationManager');

        for (const file of files) {
            validator.validateFile(file);
        }

        const result = validator.getResult();
        validator.close();

        this.logger.success(`JSON validation completed`, 'ValidationManager');

        return result;
    }

    private async validateContent(): Promise<ValidationResult> {
        this.logger.subsection('Content Validation');
        this.logger.progress('Starting content validation', 'ValidationManager');

        const validator = new ContentValidator(this.options.verbose);
        const files = await this.getFilesToValidate();

        this.logger.info(`Validating content in ${files.length} files`, 'ValidationManager');

        for (const file of files) {
            validator.validateFile(file);
        }

        const result = validator.getResult();
        validator.close();

        this.logger.success(`Content validation completed`, 'ValidationManager');

        return result;
    }

    private async validateTranslations(): Promise<ValidationResult> {
        this.logger.subsection('Translation Validation');
        this.logger.progress('Starting translation validation', 'ValidationManager');

        const validator = new TranslationValidator(this.options.verbose);
        const changedFiles = this.options.files || FileUtils.getChangedFiles();

        if (changedFiles.length === 0) {
            this.logger.info('No files changed, skipping translation validation', 'ValidationManager');
            return {
                success: true,
                errors: [],
                warnings: [],
                summary: { totalFiles: 0, totalWords: 0, errors: 0, warnings: 0, languages: [] }
            };
        }

        this.logger.info(`Validating translations for ${changedFiles.length} changed files`, 'ValidationManager');

        const result = validator.getResult();
        validator.close();

        this.logger.success(`Translation validation completed`, 'ValidationManager');

        return result;
    }

    private async validateLanguages(): Promise<ValidationResult> {
        this.logger.subsection('Language Validation');
        this.logger.progress('Starting language validation', 'ValidationManager');

        const validator = new LanguageValidator(this.options.verbose);
        validator.validateAllLanguages();
        const result = validator.getResult();
        validator.close();

        this.logger.success(`Language validation completed`, 'ValidationManager');

        return result;
    }

    private async getFilesToValidate(): Promise<string[]> {
        if (this.options.files && this.options.files.length > 0) {
            this.logger.debug(`Using specified files: ${this.options.files.length} files`, 'ValidationManager');
            return this.options.files;
        }

        this.logger.debug('Finding JSON files in data directory', 'ValidationManager');
        const files = await FileUtils.findJsonFiles('data/**/*.json');
        this.logger.debug(`Found ${files.length} JSON files`, 'ValidationManager');
        return files;
    }

    private mergeResults(results: ValidationResult[]): ValidationResult {
        this.logger.debug(`Merging ${results.length} validation results`, 'ValidationManager');

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

        this.logger.debug('Results merged successfully', 'ValidationManager', {
            totalErrors: merged.errors.length,
            totalWarnings: merged.warnings.length,
            success: merged.success
        });

        return merged;
    }

    public async generateTranslationTemplate(englishFile: string, targetLanguage: string): Promise<TemplateData> {
        this.logger.info(`Generating translation template`, 'ValidationManager', {
            sourceFile: englishFile,
            targetLanguage
        });

        try {
            // Read the English source file
            const content = readFileSync(englishFile, 'utf8');
            const englishData: ValidationData = JSON.parse(content);

            // Create template with same structure but empty translations
            const template: TemplateData = {
                week: englishData.week,
                theme: englishData.theme,
                language: targetLanguage,
                grade: englishData.grade || 'grade-1',
                words: englishData.words.map((word: WordData) => ({
                    word: word.word,
                    translation: '', // Empty for translation
                    definition: '', // Empty for translation
                    example: '', // Empty for translation
                    difficulty: word.difficulty,
                    category: word.category
                }))
            };

            this.logger.success(`Template generated successfully`, 'ValidationManager');

            return template;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.logger.error(`Failed to generate template`, 'ValidationManager', { error: errorMessage });
            throw new Error(`Template generation failed: ${errorMessage}`);
        }
    }

    public close(): void {
        this.logger.close();
    }
} 