const fs = require('fs');
const path = require('path');
const Filter = require('bad-words');

class EnhancedValidator {
    constructor() {
        this.filter = new Filter();
        this.errors = [];
        this.warnings = [];
        this.supportedLanguages = ['en', 'es', 'fr'];
        this.gradeLevels = ['grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5'];
        this.contentTypes = ['vocabulary', 'grammar', 'spelling'];
    }

    // Validate a single file
    validateFile(filePath) {
        try {
            console.log(`Validating: ${filePath}`);

            // Check if file exists
            if (!fs.existsSync(filePath)) {
                this.addError(`File not found: ${filePath}`);
                return false;
            }

            // Read and parse JSON
            const content = fs.readFileSync(filePath, 'utf8');
            let jsonData;
            try {
                jsonData = JSON.parse(content);
            } catch (parseError) {
                this.addError(`Invalid JSON in ${filePath}: ${parseError.message}`);
                return false;
            }

            // Validate structure
            this.validateStructure(jsonData, filePath);

            // Validate content
            this.validateContent(jsonData, filePath);

            // Validate language-specific content
            this.validateLanguageContent(jsonData, filePath);

            return this.errors.length === 0;
        } catch (error) {
            this.addError(`Unexpected error validating ${filePath}: ${error.message}`);
            return false;
        }
    }

    // Validate JSON structure
    validateStructure(data, filePath) {
        // Check required fields
        const requiredFields = ['week', 'theme', 'words'];
        for (const field of requiredFields) {
            if (!data.hasOwnProperty(field)) {
                this.addError(`Missing required field '${field}' in ${filePath}`);
            }
        }

        // Validate words array
        if (data.words && Array.isArray(data.words)) {
            data.words.forEach((word, index) => {
                this.validateWordStructure(word, filePath, index);
            });
        } else if (data.words) {
            this.addError(`'words' field must be an array in ${filePath}`);
        }
    }

    // Validate individual word structure
    validateWordStructure(word, filePath, index) {
        const requiredWordFields = ['word', 'translation', 'definition', 'example'];

        for (const field of requiredWordFields) {
            if (!word.hasOwnProperty(field)) {
                this.addError(`Missing required field '${field}' in word ${index} of ${filePath}`);
            } else if (typeof word[field] !== 'string') {
                this.addError(`Field '${field}' must be a string in word ${index} of ${filePath}`);
            }
        }

        // Validate optional fields
        if (word.difficulty && !['easy', 'medium', 'hard'].includes(word.difficulty)) {
            this.addWarning(`Invalid difficulty level '${word.difficulty}' in word ${index} of ${filePath}`);
        }

        // Check for profanity
        this.checkProfanity(word, filePath, index);
    }

    // Check for profanity in word content
    checkProfanity(word, filePath, index) {
        const fieldsToCheck = ['word', 'translation', 'definition', 'example'];

        for (const field of fieldsToCheck) {
            if (word[field] && this.filter.isProfane(word[field])) {
                this.addError(`Profanity detected in ${field} field of word ${index} in ${filePath}: "${word[field]}"`);
            }
        }
    }

    // Validate content quality
    validateContent(data, filePath) {
        if (data.words) {
            data.words.forEach((word, index) => {
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

                // Check for duplicate words in the same file
                const duplicateWords = data.words.filter(w => w.word === word.word);
                if (duplicateWords.length > 1) {
                    this.addWarning(`Duplicate word "${word.word}" found in ${filePath}`);
                }
            });
        }
    }

    // Validate language-specific content
    validateLanguageContent(data, filePath) {
        // Extract language from file path
        const pathParts = filePath.split(path.sep);
        const languageIndex = pathParts.findIndex(part => this.supportedLanguages.includes(part));

        if (languageIndex === -1) {
            this.addWarning(`Could not determine language from file path: ${filePath}`);
            return;
        }

        const language = pathParts[languageIndex];

        // Language-specific validations
        if (language === 'en') {
            this.validateEnglishContent(data, filePath);
        } else if (language === 'es') {
            this.validateSpanishContent(data, filePath);
        } else if (language === 'fr') {
            this.validateFrenchContent(data, filePath);
        }
    }

    // Validate English content
    validateEnglishContent(data, filePath) {
        if (data.words) {
            data.words.forEach((word, index) => {
                // Check for proper capitalization
                if (word.word && word.word !== word.word.toLowerCase() && word.word !== word.word.charAt(0).toUpperCase() + word.word.slice(1).toLowerCase()) {
                    this.addWarning(`Unusual capitalization in English word "${word.word}" in ${filePath}`);
                }
            });
        }
    }

    // Validate Spanish content
    validateSpanishContent(data, filePath) {
        if (data.words) {
            data.words.forEach((word, index) => {
                // Check for Spanish-specific characters
                if (word.translation && !/^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s]+$/.test(word.translation)) {
                    this.addWarning(`Non-Spanish characters in translation "${word.translation}" in ${filePath}`);
                }
            });
        }
    }

    // Validate French content
    validateFrenchContent(data, filePath) {
        if (data.words) {
            data.words.forEach((word, index) => {
                // Check for French-specific characters
                if (word.translation && !/^[a-zA-ZàâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s]+$/.test(word.translation)) {
                    this.addWarning(`Non-French characters in translation "${word.translation}" in ${filePath}`);
                }
            });
        }
    }

    // Validate entire directory structure
    validateDirectoryStructure(rootPath = 'data') {
        console.log('Validating directory structure...');

        for (const contentType of this.contentTypes) {
            const contentTypePath = path.join(rootPath, contentType);

            if (!fs.existsSync(contentTypePath)) {
                this.addWarning(`Missing content type directory: ${contentTypePath}`);
                continue;
            }

            for (const language of this.supportedLanguages) {
                const languagePath = path.join(contentTypePath, language);

                if (!fs.existsSync(languagePath)) {
                    this.addWarning(`Missing language directory: ${languagePath}`);
                    continue;
                }

                for (const grade of this.gradeLevels) {
                    const gradePath = path.join(languagePath, grade);

                    if (!fs.existsSync(gradePath)) {
                        this.addWarning(`Missing grade directory: ${gradePath}`);
                        continue;
                    }

                    // Check for JSON files in grade directory
                    const files = fs.readdirSync(gradePath).filter(file => file.endsWith('.json'));
                    if (files.length === 0) {
                        this.addWarning(`No JSON files found in ${gradePath}`);
                    }
                }
            }
        }
    }

    // Add error message
    addError(message) {
        this.errors.push(message);
        console.error(`❌ ERROR: ${message}`);
    }

    // Add warning message
    addWarning(message) {
        this.warnings.push(message);
        console.warn(`⚠️  WARNING: ${message}`);
    }

    // Get validation summary
    getSummary() {
        return {
            errors: this.errors,
            warnings: this.warnings,
            errorCount: this.errors.length,
            warningCount: this.warnings.length,
            success: this.errors.length === 0
        };
    }

    // Print validation summary
    printSummary() {
        console.log('\n=== Validation Summary ===');
        console.log(`Errors: ${this.errors.length}`);
        console.log(`Warnings: ${this.warnings.length}`);

        if (this.errors.length === 0) {
            console.log('✅ All validations passed!');
        } else {
            console.log('❌ Validation failed with errors:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️  Warnings:');
            this.warnings.forEach(warning => console.log(`  - ${warning}`));
        }
    }
}

// CLI usage
if (require.main === module) {
    const validator = new EnhancedValidator();

    if (process.argv.length < 3) {
        console.log('Usage: node enhanced-validator.js <file-or-directory>');
        console.log('Examples:');
        console.log('  node enhanced-validator.js data/vocabulary/en/grade-1/week-1.json');
        console.log('  node enhanced-validator.js data/');
        process.exit(1);
    }

    const target = process.argv[2];

    if (fs.existsSync(target)) {
        if (fs.statSync(target).isDirectory()) {
            // Validate entire directory
            validator.validateDirectoryStructure(target);

            // Find and validate all JSON files
            const findJsonFiles = (dir) => {
                const files = [];
                const items = fs.readdirSync(dir);

                for (const item of items) {
                    const fullPath = path.join(dir, item);
                    const stat = fs.statSync(fullPath);

                    if (stat.isDirectory()) {
                        files.push(...findJsonFiles(fullPath));
                    } else if (item.endsWith('.json')) {
                        files.push(fullPath);
                    }
                }

                return files;
            };

            const jsonFiles = findJsonFiles(target);
            console.log(`\nFound ${jsonFiles.length} JSON files to validate...`);

            let successCount = 0;
            for (const file of jsonFiles) {
                if (validator.validateFile(file)) {
                    successCount++;
                }
            }

            console.log(`\nValidated ${jsonFiles.length} files, ${successCount} passed validation.`);
        } else {
            // Validate single file
            validator.validateFile(target);
        }
    } else {
        console.error(`Target not found: ${target}`);
        process.exit(1);
    }

    validator.printSummary();

    if (!validator.getSummary().success) {
        process.exit(1);
    }
}

module.exports = EnhancedValidator; 