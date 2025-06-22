import { BaseValidator } from './BaseValidator.js';
import { FileUtils } from '../utils/FileUtils.js';
import Filter from 'bad-words';
import { ValidationData, WordData, ValidationSummary } from '../types/index.js';

export class ContentValidator extends BaseValidator {
    private filter: Filter;
    private wordCount: number = 0;

    constructor(verbose: boolean = false) {
        super(verbose);
        this.filter = new Filter();
    }

    public validateFile(filePath: string): void {
        try {
            this.log(`Validating content: ${filePath}`);

            if (!FileUtils.fileExists(filePath)) {
                this.addError(`File not found: ${filePath}`);
                return;
            }

            const data: ValidationData = FileUtils.readJsonFile(filePath);

            // Check if this is a spelling or grammar file
            if (this.isSpellingOrGrammarFile(filePath)) {
                this.validateSpellingOrGrammarContent(data, filePath);
            } else {
                this.validateVocabularyContent(data, filePath);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            this.addError(`Failed to parse file: ${errorMessage}`, filePath);
        }
    }

    private isSpellingOrGrammarFile(filePath: string): boolean {
        return filePath.includes('/spelling/') || filePath.includes('/grammar/');
    }

    private validateSpellingOrGrammarContent(data: any, filePath: string): void {
        // For spelling files, validate the spelling-specific structure
        if (filePath.includes('/spelling/')) {
            this.validateSpellingContent(data, filePath);
        }
        // For grammar files, validate the grammar-specific structure
        else if (filePath.includes('/grammar/')) {
            this.validateGrammarContent(data, filePath);
        }
    }

    private validateSpellingContent(data: any, filePath: string): void {
        // Validate spelling file structure
        if (!data.metadata) {
            this.addError('Missing metadata section', filePath);
        }

        if (!data.spellingRule) {
            this.addError('Missing spellingRule section', filePath);
        }

        if (!data.words || !Array.isArray(data.words)) {
            this.addError('Missing or invalid words array', filePath);
            return;
        }

        // Count words
        this.wordCount += data.words.length;
        this.debug(`Found ${data.words.length} spelling words in ${filePath}, total count: ${this.wordCount}`);

        // Validate each word in spelling format
        data.words.forEach((word: any, index: number) => {
            this.validateSpellingWord(word, filePath, index);
        });
    }

    private validateGrammarContent(data: any, filePath: string): void {
        // Validate grammar file structure
        if (!data.metadata) {
            this.addError('Missing metadata section', filePath);
        }

        if (!data.grammar) {
            this.addError('Missing grammar section', filePath);
        }

        if (!data.grammar.rules || !Array.isArray(data.grammar.rules)) {
            this.addError('Missing or invalid grammar rules array', filePath);
        }

        // Count grammar rules as "words" for summary purposes
        if (data.grammar.rules) {
            this.wordCount += data.grammar.rules.length;
        }
    }

    private validateSpellingWord(word: any, filePath: string, index: number): void {
        if (!word.word || word.word.trim() === '') {
            this.addError(`Word ${index + 1}: Missing or empty word field`, filePath);
        }

        // Check for profanity in word field
        if (typeof word.word === 'string' && this.filter.isProfane(word.word)) {
            this.addError(`Profanity detected in word field of word ${index + 1} in ${filePath}: "${word.word}"`);
        }

        // Validate word length
        if (word.word && word.word.length > 50) {
            this.addWarning(`Word ${index + 1}: Word is very long (${word.word.length} characters)`, filePath);
        }

        if (word.word && word.word.length < 2) {
            this.addWarning(`Very short word in ${filePath} word ${index + 1}: "${word.word}"`);
        }
    }

    private validateVocabularyContent(data: any, filePath: string): void {
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

        // Count words
        this.wordCount += words.length;
        this.debug(`Found ${words.length} words in ${filePath}, total count: ${this.wordCount}`);

        words.forEach((word: WordData, index: number) => {
            this.validateVocabularyWord(word, filePath, index);
        });
    }

    private validateVocabularyWord(word: WordData, filePath: string, index: number): void {
        if (!word.word || word.word.trim() === '') {
            this.addError(`Word ${index + 1}: Missing or empty word field`, filePath);
        }

        if (!word.translation || word.translation.trim() === '') {
            this.addError(`Word ${index + 1}: Missing or empty translation field`, filePath);
        }

        if (!word.definition || word.definition.trim() === '') {
            this.addError(`Word ${index + 1}: Missing or empty definition field`, filePath);
        }

        if (!word.example || word.example.trim() === '') {
            this.addError(`Word ${index + 1}: Missing or empty example field`, filePath);
        }

        // Validate difficulty if provided
        if (word.difficulty && !['easy', 'medium', 'hard'].includes(word.difficulty)) {
            this.addWarning(`Word ${index + 1}: Invalid difficulty level "${word.difficulty}"`, filePath);
        }

        // Validate word length
        if (word.word && word.word.length > 50) {
            this.addWarning(`Word ${index + 1}: Word is very long (${word.word.length} characters)`, filePath);
        }

        // Validate definition length
        if (word.definition && word.definition.length > 200) {
            this.addWarning(`Word ${index + 1}: Definition is very long (${word.definition.length} characters)`, filePath);
        }

        // Check for profanity in all text fields
        const fieldsToCheck: (keyof WordData)[] = ['word', 'translation', 'definition', 'example'];
        for (const field of fieldsToCheck) {
            const fieldValue = word[field];
            if (typeof fieldValue === 'string' && this.filter.isProfane(fieldValue)) {
                this.addError(`Profanity detected in ${field} field of word ${index + 1} in ${filePath}: "${fieldValue}"`);
            }
        }

        // Check for empty or very short content
        if (word.word && word.word.length < 2 && !filePath.includes('letters.json')) {
            this.addWarning(`Very short word in ${filePath} word ${index + 1}: "${word.word}"`);
        }

        if (word.definition && word.definition.length < 10) {
            this.addWarning(`Very short definition in ${filePath} word ${index + 1}: "${word.definition}"`);
        }

        if (word.example && word.example.length < 10) {
            this.addWarning(`Very short example in ${filePath} word ${index + 1}: "${word.example}"`);
        }
    }

    protected generateSummary(): ValidationSummary {
        return {
            totalFiles: this.errors.length + this.warnings.length,
            totalWords: this.wordCount,
            errors: this.errors.length,
            warnings: this.warnings.length,
            languages: []
        };
    }
} 