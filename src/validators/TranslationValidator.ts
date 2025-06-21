import { BaseValidator } from './BaseValidator';
import { TranslationComparison, TranslationError, VocabularyData, SupportedLanguage } from '../types';
import { FileUtils } from '../utils/FileUtils';
import { LanguageUtils } from '../utils/LanguageUtils';
import chalk from 'chalk';

export class TranslationValidator extends BaseValidator {
    private readonly baseLanguage: SupportedLanguage = 'en';
    private readonly supportedLanguages: SupportedLanguage[] = ['en', 'es', 'fr', 'ar', 'ko'];

    constructor(verbose: boolean = false) {
        super(verbose);
    }

    public validateChanges(changedFiles: string[]): TranslationComparison[] {
        this.log('🔍 Starting translation validation...');

        if (changedFiles.length === 0) {
            this.log('No files changed, skipping translation validation');
            return [];
        }

        const comparisons: TranslationComparison[] = [];
        const fileGroups = this.groupFilesByLanguage(changedFiles);

        for (const [language, files] of Object.entries(fileGroups)) {
            if (language === this.baseLanguage) continue;

            this.log(`📝 Validating translations for ${language}...`);

            for (const file of files) {
                const comparison = this.validateFileTranslations(file, language as SupportedLanguage);
                if (comparison) {
                    comparisons.push(comparison);
                }
            }
        }

        return comparisons;
    }

    private groupFilesByLanguage(changedFiles: string[]): Record<string, string[]> {
        const groups: Record<string, string[]> = {};

        for (const file of changedFiles) {
            const language = LanguageUtils.extractLanguageFromPath(file);
            if (language && this.supportedLanguages.includes(language as SupportedLanguage)) {
                if (!groups[language]) groups[language] = [];
                groups[language].push(file);
            }
        }

        return groups;
    }

    private validateFileTranslations(file: string, language: SupportedLanguage): TranslationComparison | null {
        const englishFile = this.findCorrespondingEnglishFile(file);
        if (!englishFile) {
            this.addWarning(`No corresponding English file found for ${file}`);
            return null;
        }

        try {
            const englishData = FileUtils.readJsonFile<VocabularyData>(englishFile);
            const targetData = FileUtils.readJsonFile<VocabularyData>(file);

            const comparison: TranslationComparison = {
                englishFile,
                targetFile: file,
                language,
                missingWords: [],
                extraWords: [],
                translationErrors: []
            };

            this.compareVocabularyWords(englishData, targetData, comparison);

            return comparison;
        } catch (error) {
            this.addError(`Error comparing translations in ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            return null;
        }
    }

    private findCorrespondingEnglishFile(nonEnglishFile: string): string | null {
        const pathParts = nonEnglishFile.split('/');
        const languageIndex = pathParts.findIndex(part => this.supportedLanguages.includes(part as SupportedLanguage));

        if (languageIndex === -1) return null;

        pathParts[languageIndex] = this.baseLanguage;
        const englishFile = pathParts.join('/');

        return FileUtils.fileExists(englishFile) ? englishFile : null;
    }

    private compareVocabularyWords(englishData: VocabularyData, targetData: VocabularyData, comparison: TranslationComparison): void {
        const englishWords = englishData.vocabulary?.words || [];
        const targetWords = targetData.vocabulary?.words || [];

        const englishWordMap = new Map(englishWords.map(word => [word.word, word]));
        const targetWordMap = new Map(targetWords.map(word => [word.word, word]));

        for (const englishWord of englishWords) {
            if (!targetWordMap.has(englishWord.word)) {
                comparison.missingWords.push(englishWord.word);
                this.addError(`Missing translation for word "${englishWord.word}" in ${comparison.targetFile}`);
            }
        }

        for (const targetWord of targetWords) {
            if (!englishWordMap.has(targetWord.word)) {
                comparison.extraWords.push(targetWord.word);
                this.addWarning(`Extra word "${targetWord.word}" in ${comparison.targetFile} not found in English version`);
            }
        }

        for (const targetWord of targetWords) {
            const englishWord = englishWordMap.get(targetWord.word);
            if (englishWord) {
                this.validateTranslationAccuracy(targetWord, englishWord, comparison);
            }
        }
    }

    private validateTranslationAccuracy(targetWord: any, englishWord: any, comparison: TranslationComparison): void {
        if (!targetWord.translation || targetWord.translation.trim() === '') {
            comparison.translationErrors.push({
                word: targetWord.word,
                type: 'missing_translation',
                message: 'Missing translation'
            });
            this.addError(`Missing translation for word "${targetWord.word}" in ${comparison.targetFile}`);
            return;
        }

        const translation = targetWord.translation.toLowerCase().trim();
        const englishWordLower = englishWord.word.toLowerCase().trim();

        if (translation === englishWordLower) {
            comparison.translationErrors.push({
                word: targetWord.word,
                type: 'same_as_english',
                message: 'Translation appears to be the same as English word'
            });
            this.addWarning(`Translation "${translation}" for word "${targetWord.word}" in ${comparison.targetFile} appears to be the same as English word`);
        }

        const requiredFields = ['definition', 'example'] as const;
        for (const field of requiredFields) {
            if (!targetWord[field] || targetWord[field].trim() === '') {
                comparison.translationErrors.push({
                    word: targetWord.word,
                    type: field === 'definition' ? 'missing_definition' : 'missing_example',
                    message: `Missing ${field}`
                });
                this.addError(`Missing ${field} for word "${targetWord.word}" in ${comparison.targetFile}`);
            }
        }

        if (targetWord.difficulty && englishWord.difficulty) {
            if (targetWord.difficulty !== englishWord.difficulty) {
                this.addWarning(`Difficulty level mismatch for word "${targetWord.word}" in ${comparison.targetFile}: ${targetWord.difficulty} vs ${englishWord.difficulty}`);
            }
        }
    }

    protected generateSummary(): any {
        return {
            totalComparisons: this.errors.length + this.warnings.length,
            errors: this.errors.length,
            warnings: this.warnings.length
        };
    }
} 