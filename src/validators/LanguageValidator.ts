import { BaseValidator } from './BaseValidator';
import { SupportedLanguage, ContentType, GradeLevel } from '../types';
import { FileUtils } from '../utils/FileUtils';
import { LanguageUtils } from '../utils/LanguageUtils';

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
            const filePath = `${gradePath}/${file}`;
            this.validateFile(filePath, language);
        }
    }

    private validateFile(filePath: string, language: SupportedLanguage): void {
        try {
            const content = FileUtils.readFile(filePath);

            if (!FileUtils.isValidUTF8(content)) {
                this.addError(`Invalid UTF-8 encoding in ${filePath}`);
            }

            const jsonData = FileUtils.readJsonFile(filePath);
            this.validateLanguageSpecificContent(jsonData, filePath, language);
        } catch (error) {
            this.addError(`Error reading file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private validateLanguageSpecificContent(data: any, filePath: string, language: SupportedLanguage): void {
        if (!data.vocabulary || !Array.isArray(data.vocabulary.words)) {
            return;
        }

        data.vocabulary.words.forEach((word: any, index: number) => {
            if (!word.translation) {
                this.addWarning(`Missing translation in ${filePath} word ${index}`);
                return;
            }

            this.validateCharacters(word.translation, language, filePath, index);
        });
    }

    private validateCharacters(text: string, language: SupportedLanguage, filePath: string, index: number): void {
        if (!LanguageUtils.validateCharacters(text, language)) {
            this.addWarning(`Non-${language} characters in translation "${text}" in ${filePath} word ${index}`);
        }
    }

    private checkCrossLanguageConsistency(contentType: ContentType): void {
        this.log(`  🔍 Checking cross-language consistency for ${contentType}...`);
        // Implementation for cross-language consistency check
    }

    protected generateSummary(): any {
        return {
            totalFiles: this.errors.length + this.warnings.length,
            errors: this.errors.length,
            warnings: this.warnings.length
        };
    }
} 