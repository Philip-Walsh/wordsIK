import { BaseValidator } from './BaseValidator.js';
import { TranslationComparison, ValidationData, WordData, ValidationSummary } from '../types/index.js';
import { FileUtils } from '../utils/FileUtils.js';

export class TranslationValidator extends BaseValidator {
    private comparisons: TranslationComparison[] = [];

    constructor(verbose: boolean = false) {
        super(verbose);
    }

    public validateChanges(changedFiles: string[]): TranslationComparison[] {
        this.log('🔄 Validating translation changes...');

        for (const file of changedFiles) {
            if (this.isTranslationFile(file)) {
                this.validateTranslationFile(file);
            }
        }

        return this.comparisons;
    }

    private isTranslationFile(filePath: string): boolean {
        return filePath.includes('/vocabulary/') && !filePath.includes('/en/');
    }

    private validateTranslationFile(filePath: string): void {
        try {
            const data: ValidationData = FileUtils.readJsonFile(filePath);

            // Find corresponding English file
            const englishFile = this.findEnglishFile(filePath);
            if (englishFile && FileUtils.fileExists(englishFile)) {
                this.compareWithEnglish(filePath, englishFile, data);
            } else {
                this.addWarning(`No corresponding English file found for ${filePath}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.addError(`Failed to parse translation file: ${errorMessage}`, filePath);
        }
    }

    private findEnglishFile(filePath: string): string | null {
        // Extract language and path structure
        const pathParts = filePath.split('/');
        const languageIndex = pathParts.findIndex(part => ['es', 'fr', 'ar', 'ko'].includes(part));

        if (languageIndex === -1) {
            return null;
        }

        // Replace language with 'en'
        pathParts[languageIndex] = 'en';
        return pathParts.join('/');
    }

    private compareWithEnglish(translationFile: string, englishFile: string, translationData: ValidationData): void {
        try {
            const englishData: ValidationData = FileUtils.readJsonFile(englishFile);

            const comparison: TranslationComparison = {
                englishFile,
                targetFile: translationFile,
                language: this.extractLanguage(translationFile),
                missingWords: [],
                extraWords: [],
                translationErrors: []
            };

            this.validateTranslationAccuracy(englishData, translationData, comparison);
            this.comparisons.push(comparison);

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.addError(`Failed to compare with English file: ${errorMessage}`, translationFile);
        }
    }

    private validateTranslationAccuracy(englishData: any, translationData: any, comparison: TranslationComparison): void {
        // Handle both flat structure (ValidationData) and nested structure (VocabularyData)
        let englishWords: WordData[] = [];
        let translationWords: WordData[] = [];

        if (englishData.words && Array.isArray(englishData.words)) {
            englishWords = englishData.words;
        } else if (englishData.vocabulary && englishData.vocabulary.words && Array.isArray(englishData.vocabulary.words)) {
            englishWords = englishData.vocabulary.words;
        }

        if (translationData.words && Array.isArray(translationData.words)) {
            translationWords = translationData.words;
        } else if (translationData.vocabulary && translationData.vocabulary.words && Array.isArray(translationData.vocabulary.words)) {
            translationWords = translationData.vocabulary.words;
        }

        const englishWordsMap = new Map<string, WordData>();
        const translationWordsMap = new Map<string, WordData>();

        // Build maps for comparison
        englishWords.forEach((word: WordData) => {
            englishWordsMap.set(word.word.toLowerCase(), word);
        });

        translationWords.forEach((word: WordData) => {
            translationWordsMap.set(word.word.toLowerCase(), word);
        });

        // Check for missing words in translation
        for (const [englishWord, englishWordData] of englishWordsMap) {
            if (!translationWordsMap.has(englishWord)) {
                comparison.missingWords.push(englishWord);
                comparison.translationErrors.push({
                    word: englishWord,
                    type: 'missing_translation',
                    message: `Word "${englishWord}" is missing in translation`
                });
            } else {
                const translationWord = translationWordsMap.get(englishWord)!;
                this.validateWordAccuracy(translationWord, englishWordData, comparison);
            }
        }

        // Check for extra words in translation
        for (const [translationWord] of translationWordsMap) {
            if (!englishWordsMap.has(translationWord)) {
                comparison.extraWords.push(translationWord);
            }
        }
    }

    private validateWordAccuracy(targetWord: WordData, englishWord: WordData, comparison: TranslationComparison): void {
        // Check if translation is empty
        if (!targetWord.translation || targetWord.translation.trim() === '') {
            comparison.translationErrors.push({
                word: targetWord.word,
                type: 'empty_translation',
                message: `Translation is empty for word "${targetWord.word}"`
            });
        }

        // Check if translation is same as English
        if (targetWord.translation === englishWord.word) {
            comparison.translationErrors.push({
                word: targetWord.word,
                type: 'same_as_english',
                message: `Translation is same as English word "${targetWord.word}"`
            });
        }

        // Check if definition is missing
        if (!targetWord.definition || targetWord.definition.trim() === '') {
            comparison.translationErrors.push({
                word: targetWord.word,
                type: 'missing_definition',
                message: `Definition is missing for word "${targetWord.word}"`
            });
        }

        // Check if example is missing
        if (!targetWord.example || targetWord.example.trim() === '') {
            comparison.translationErrors.push({
                word: targetWord.word,
                type: 'missing_example',
                message: `Example is missing for word "${targetWord.word}"`
            });
        }
    }

    private extractLanguage(filePath: string): string {
        const pathParts = filePath.split('/');
        const languageIndex = pathParts.findIndex(part => ['es', 'fr', 'ar', 'ko'].includes(part));
        return languageIndex !== -1 ? pathParts[languageIndex] : 'unknown';
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