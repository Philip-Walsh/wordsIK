import { BaseValidator } from './BaseValidator.js';
import { SupportedLanguage, ContentType, ValidationData, WordData, GradeLevel, ValidationSummary } from '../types/index.js';
import { FileUtils } from '../utils/FileUtils.js';
import { LanguageUtils } from '../utils/LanguageUtils.js';

export class LanguageValidator extends BaseValidator {
    private readonly supportedLanguages: SupportedLanguage[] = ['en', 'es', 'fr', 'ar', 'ko'];
    private readonly gradeLevels: GradeLevel[] = ['grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5'];
    private readonly contentTypes: ContentType[] = ['vocabulary', 'grammar', 'spelling'];

    constructor(verbose: boolean = false) {
        super(verbose);
    }

    public validateAllLanguages(): void {
        this.log('🌍 Validating multi-language content...');

        for (const contentType of this.contentTypes) {
            this.log(`📚 Checking ${contentType} content...`);
            this.validateContentType(contentType);
        }
    }

    private validateContentType(contentType: ContentType): void {
        const contentTypePath = `data/${contentType}`;

        if (!FileUtils.fileExists(contentTypePath)) {
            this.addWarning(`Content type directory not found: ${contentTypePath}`);
            return;
        }

        for (const language of this.supportedLanguages) {
            const languagePath = `${contentTypePath}/${language}`;

            if (!FileUtils.fileExists(languagePath)) {
                this.addWarning(`Language directory not found: ${languagePath}`);
                continue;
            }

            this.validateLanguage(contentType, language);
        }

        this.checkCrossLanguageConsistency(contentType);
    }

    private validateLanguage(contentType: ContentType, language: SupportedLanguage): void {
        this.log(`  🌐 Validating ${language}...`);

        for (const grade of this.gradeLevels) {
            const gradePath = `data/${contentType}/${language}/${grade}`;

            if (!FileUtils.fileExists(gradePath)) {
                this.addWarning(`Grade directory not found: ${gradePath}`);
                continue;
            }

            this.validateGrade(contentType, language, grade);
        }
    }

    private validateGrade(contentType: ContentType, language: SupportedLanguage, grade: GradeLevel): void {
        const gradePath = `data/${contentType}/${language}/${grade}`;
        const files = FileUtils.getJsonFilesInDirectory(gradePath);

        if (files.length === 0) {
            this.addWarning(`No JSON files found in ${gradePath}`);
            return;
        }

        for (const file of files) {
            this.validateLanguageFile(file, language);
        }
    }

    private validateLanguageFile(filePath: string, language: SupportedLanguage): void {
        try {
            const data: ValidationData = FileUtils.readJsonFile(filePath);
            this.validateLanguageSpecificContent(data, filePath, language);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.addError(`Failed to parse language file: ${errorMessage}`, filePath);
        }
    }

    private validateLanguageSpecificContent(data: any, filePath: string, language: SupportedLanguage): void {
        // Handle both flat structure (ValidationData) and nested structure (VocabularyData)
        let words: WordData[] = [];

        if (data.words && Array.isArray(data.words)) {
            // Flat structure: data.words
            words = data.words;
        } else if (data.vocabulary && data.vocabulary.words && Array.isArray(data.vocabulary.words)) {
            // Nested structure: data.vocabulary.words
            words = data.vocabulary.words;
        } else {
            this.addError('Missing or invalid words array', filePath);
            return;
        }

        words.forEach((word: WordData, index: number) => {
            this.validateWordLanguage(word, filePath, language, index);
        });
    }

    private validateWordLanguage(word: WordData, filePath: string, language: SupportedLanguage, index: number): void {
        if (!word.translation) {
            this.addWarning(`Missing translation in ${filePath} word ${index + 1}`);
            return;
        }

        this.validateCharacters(word.translation, language, filePath, index);
    }

    private validateCharacters(text: string, language: SupportedLanguage, filePath: string, index: number): void {
        if (!LanguageUtils.validateCharacters(text, language)) {
            this.addWarning(`Non-${language} characters in translation "${text}" in ${filePath} word ${index + 1}`);
        }
    }

    private checkCrossLanguageConsistency(contentType: ContentType): void {
        this.log(`  🔍 Checking cross-language consistency for ${contentType}...`);
        // Implementation for cross-language consistency check
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