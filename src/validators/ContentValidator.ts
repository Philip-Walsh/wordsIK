import { BaseValidator } from './BaseValidator';
import { FileUtils } from '../utils/FileUtils';
import Filter from 'bad-words';

export class ContentValidator extends BaseValidator {
    private filter: Filter;

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

            const content = FileUtils.readJsonFile(filePath);
            this.validateContent(content, filePath);
        } catch (error) {
            this.addError(`Error validating content in ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private validateContent(data: any, filePath: string): void {
        if (data.vocabulary && data.vocabulary.words) {
            data.vocabulary.words.forEach((word: any, index: number) => {
                this.validateWord(word, filePath, index);
            });
        }
    }

    private validateWord(word: any, filePath: string, index: number): void {
        const fieldsToCheck = ['word', 'translation', 'definition', 'example'];

        for (const field of fieldsToCheck) {
            if (word[field] && this.filter.isProfane(word[field])) {
                this.addError(`Profanity detected in ${field} field of word ${index} in ${filePath}: "${word[field]}"`);
            }
        }

        // Check for empty or very short content
        if (word.word && word.word.length < 2) {
            this.addWarning(`Very short word in ${filePath} word ${index}: "${word.word}"`);
        }

        if (word.definition && word.definition.length < 10) {
            this.addWarning(`Very short definition in ${filePath} word ${index}: "${word.definition}"`);
        }

        if (word.example && word.example.length < 10) {
            this.addWarning(`Very short example in ${filePath} word ${index}: "${word.example}"`);
        }
    }

    protected generateSummary(): any {
        return {
            totalFiles: this.errors.length + this.warnings.length,
            errors: this.errors.length,
            warnings: this.warnings.length
        };
    }
} 