#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class LanguageValidator {
    constructor() {
        this.supportedLanguages = ['en', 'es', 'fr'];
        this.gradeLevels = ['grade-1', 'grade-2', 'grade-3', 'grade-4', 'grade-5'];
        this.contentTypes = ['vocabulary', 'grammar', 'spelling'];
        this.errors = [];
        this.warnings = [];
    }

    // Validate all languages in the repository
    validateAllLanguages() {
        console.log('🌍 Validating multi-language content...\n');

        for (const contentType of this.contentTypes) {
            console.log(`📚 Checking ${contentType} content...`);
            this.validateContentType(contentType);
        }

        this.printSummary();
    }

    // Validate a specific content type across all languages
    validateContentType(contentType) {
        const contentTypePath = path.join('data', contentType);

        if (!fs.existsSync(contentTypePath)) {
            this.addWarning(`Content type directory not found: ${contentTypePath}`);
            return;
        }

        // Check each language
        for (const language of this.supportedLanguages) {
            const languagePath = path.join(contentTypePath, language);

            if (!fs.existsSync(languagePath)) {
                this.addWarning(`Language directory not found: ${languagePath}`);
                continue;
            }

            this.validateLanguage(contentType, language);
        }

        // Check for consistency across languages
        this.checkCrossLanguageConsistency(contentType);
    }

    // Validate a specific language
    validateLanguage(contentType, language) {
        console.log(`  🌐 Validating ${language}...`);

        for (const grade of this.gradeLevels) {
            const gradePath = path.join('data', contentType, language, grade);

            if (!fs.existsSync(gradePath)) {
                this.addWarning(`Grade directory not found: ${gradePath}`);
                continue;
            }

            this.validateGrade(contentType, language, grade);
        }
    }

    // Validate a specific grade level
    validateGrade(contentType, language, grade) {
        const gradePath = path.join('data', contentType, language, grade);
        const files = fs.readdirSync(gradePath).filter(file => file.endsWith('.json'));

        if (files.length === 0) {
            this.addWarning(`No JSON files found in ${gradePath}`);
            return;
        }

        for (const file of files) {
            const filePath = path.join(gradePath, file);
            this.validateFile(filePath, language);
        }
    }

    // Validate a single file
    validateFile(filePath, language) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');

            // Check UTF-8 encoding
            if (!this.isValidUTF8(content)) {
                this.addError(`Invalid UTF-8 encoding in ${filePath}`);
            }

            // Parse JSON
            let jsonData;
            try {
                jsonData = JSON.parse(content);
            } catch (parseError) {
                this.addError(`Invalid JSON in ${filePath}: ${parseError.message}`);
                return;
            }

            // Language-specific validation
            this.validateLanguageSpecificContent(jsonData, filePath, language);

        } catch (error) {
            this.addError(`Error reading file ${filePath}: ${error.message}`);
        }
    }

    // Validate language-specific content
    validateLanguageSpecificContent(data, filePath, language) {
        if (!data.words || !Array.isArray(data.words)) {
            return;
        }

        data.words.forEach((word, index) => {
            // Check translation field
            if (!word.translation) {
                this.addWarning(`Missing translation in ${filePath} word ${index}`);
                return;
            }

            // Language-specific character validation
            this.validateCharacters(word.translation, language, filePath, index);
        });
    }

    // Validate characters for specific language
    validateCharacters(text, language, filePath, index) {
        const patterns = {
            'en': /^[a-zA-Z\s\-'.,!?]+$/,
            'es': /^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s\-'.,!?]+$/,
            'fr': /^[a-zA-ZàâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s\-'.,!?]+$/
        };

        const pattern = patterns[language];
        if (pattern && !pattern.test(text)) {
            this.addWarning(`Non-${language} characters in translation "${text}" in ${filePath} word ${index}`);
        }
    }

    // Check consistency across languages
    checkCrossLanguageConsistency(contentType) {
        console.log(`  🔍 Checking cross-language consistency for ${contentType}...`);

        // Get all themes across languages
        const themes = this.getAllThemes(contentType);

        for (const theme of themes) {
            this.checkThemeConsistency(contentType, theme);
        }
    }

    // Get all themes for a content type
    getAllThemes(contentType) {
        const themes = new Set();

        for (const language of this.supportedLanguages) {
            const languagePath = path.join('data', contentType, language);

            if (!fs.existsSync(languagePath)) continue;

            for (const grade of this.gradeLevels) {
                const gradePath = path.join(languagePath, grade);

                if (!fs.existsSync(gradePath)) continue;

                const files = fs.readdirSync(gradePath).filter(file => file.endsWith('.json'));

                for (const file of files) {
                    try {
                        const filePath = path.join(gradePath, file);
                        const content = fs.readFileSync(filePath, 'utf8');
                        const data = JSON.parse(content);

                        if (data.theme) {
                            themes.add(data.theme);
                        }
                    } catch (error) {
                        // Skip files with errors
                    }
                }
            }
        }

        return Array.from(themes);
    }

    // Check theme consistency across languages
    checkThemeConsistency(contentType, theme) {
        const themeLanguages = [];

        for (const language of this.supportedLanguages) {
            const hasTheme = this.languageHasTheme(contentType, language, theme);
            if (hasTheme) {
                themeLanguages.push(language);
            }
        }

        if (themeLanguages.length > 1) {
            console.log(`    ✅ Theme "${theme}" found in: ${themeLanguages.join(', ')}`);
        } else if (themeLanguages.length === 1) {
            this.addWarning(`Theme "${theme}" only found in ${themeLanguages[0]} - consider adding to other languages`);
        }
    }

    // Check if a language has a specific theme
    languageHasTheme(contentType, language, theme) {
        const languagePath = path.join('data', contentType, language);

        if (!fs.existsSync(languagePath)) return false;

        for (const grade of this.gradeLevels) {
            const gradePath = path.join(languagePath, grade);

            if (!fs.existsSync(gradePath)) continue;

            const files = fs.readdirSync(gradePath).filter(file => file.endsWith('.json'));

            for (const file of files) {
                try {
                    const filePath = path.join(gradePath, file);
                    const content = fs.readFileSync(filePath, 'utf8');
                    const data = JSON.parse(content);

                    if (data.theme === theme) {
                        return true;
                    }
                } catch (error) {
                    // Skip files with errors
                }
            }
        }

        return false;
    }

    // Check if text is valid UTF-8
    isValidUTF8(text) {
        try {
            Buffer.from(text, 'utf8');
            return true;
        } catch (error) {
            return false;
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

    // Print validation summary
    printSummary() {
        console.log('\n=== Multi-Language Validation Summary ===');
        console.log(`Errors: ${this.errors.length}`);
        console.log(`Warnings: ${this.warnings.length}`);

        if (this.errors.length === 0) {
            console.log('✅ Multi-language validation passed!');
        } else {
            console.log('❌ Multi-language validation failed with errors:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }

        if (this.warnings.length > 0) {
            console.log('\n⚠️  Warnings:');
            this.warnings.forEach(warning => console.log(`  - ${warning}`));
        }

        console.log('\n🌍 Language Coverage:');
        for (const contentType of this.contentTypes) {
            console.log(`  ${contentType}:`);
            for (const language of this.supportedLanguages) {
                const hasContent = this.hasContent(contentType, language);
                const status = hasContent ? '✅' : '❌';
                console.log(`    ${status} ${language}`);
            }
        }
    }

    // Check if a language has content for a content type
    hasContent(contentType, language) {
        const languagePath = path.join('data', contentType, language);

        if (!fs.existsSync(languagePath)) return false;

        for (const grade of this.gradeLevels) {
            const gradePath = path.join(languagePath, grade);

            if (fs.existsSync(gradePath)) {
                const files = fs.readdirSync(gradePath).filter(file => file.endsWith('.json'));
                if (files.length > 0) {
                    return true;
                }
            }
        }

        return false;
    }
}

// CLI usage
if (require.main === module) {
    const validator = new LanguageValidator();
    validator.validateAllLanguages();

    if (validator.errors.length > 0) {
        process.exit(1);
    }
}

module.exports = LanguageValidator; 