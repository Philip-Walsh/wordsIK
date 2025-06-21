import { BaseValidator } from './BaseValidator';
import { FileUtils } from '../utils/FileUtils';

export class JsonValidator extends BaseValidator {
    public validateFile(filePath: string): void {
        try {
            this.log(`Validating JSON: ${filePath}`);

            if (!FileUtils.fileExists(filePath)) {
                this.addError(`File not found: ${filePath}`);
                return;
            }

            const content = FileUtils.readFile(filePath);

            if (!FileUtils.isValidUTF8(content)) {
                this.addError(`Invalid UTF-8 encoding in ${filePath}`);
                return;
            }

            try {
                JSON.parse(content);
                this.log(`✅ Valid JSON: ${filePath}`);
            } catch (parseError) {
                this.addError(`Invalid JSON in ${filePath}: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
            }
        } catch (error) {
            this.addError(`Error reading file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
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