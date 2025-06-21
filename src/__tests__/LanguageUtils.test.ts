import { LanguageUtils } from '../utils/LanguageUtils';
import { SupportedLanguage } from '../types';

describe('LanguageUtils', () => {
    describe('extractLanguageFromPath', () => {
        it('should extract English language from path', () => {
            const path = 'data/en/grade-1/week-1.json';
            const result = LanguageUtils.extractLanguageFromPath(path);
            expect(result).toBe('en');
        });

        it('should extract Spanish language from path', () => {
            const path = 'data/es/vocabulary/grade-2/week-3.json';
            const result = LanguageUtils.extractLanguageFromPath(path);
            expect(result).toBe('es');
        });

        it('should extract French language from path', () => {
            const path = 'data/fr/grammar/grade-1/week-1.json';
            const result = LanguageUtils.extractLanguageFromPath(path);
            expect(result).toBe('fr');
        });

        it('should extract Arabic language from path', () => {
            const path = 'data/ar/vocabulary/grade-1/week-1.json';
            const result = LanguageUtils.extractLanguageFromPath(path);
            expect(result).toBe('ar');
        });

        it('should extract Korean language from path', () => {
            const path = 'data/ko/spelling/grade-1/week-1.json';
            const result = LanguageUtils.extractLanguageFromPath(path);
            expect(result).toBe('ko');
        });

        it('should return null when no language found in path', () => {
            const path = 'data/vocabulary/week-1.json';
            const result = LanguageUtils.extractLanguageFromPath(path);
            expect(result).toBeNull();
        });

        it('should return null for empty path', () => {
            const result = LanguageUtils.extractLanguageFromPath('');
            expect(result).toBeNull();
        });

        it('should return null for path with unsupported language', () => {
            const path = 'data/de/vocabulary/week-1.json';
            const result = LanguageUtils.extractLanguageFromPath(path);
            expect(result).toBeNull();
        });
    });

    describe('isValidLanguage', () => {
        it('should return true for valid languages', () => {
            expect(LanguageUtils.isValidLanguage('en')).toBe(true);
            expect(LanguageUtils.isValidLanguage('es')).toBe(true);
            expect(LanguageUtils.isValidLanguage('fr')).toBe(true);
            expect(LanguageUtils.isValidLanguage('ar')).toBe(true);
            expect(LanguageUtils.isValidLanguage('ko')).toBe(true);
        });

        it('should return false for invalid languages', () => {
            expect(LanguageUtils.isValidLanguage('de')).toBe(false);
            expect(LanguageUtils.isValidLanguage('it')).toBe(false);
            expect(LanguageUtils.isValidLanguage('pt')).toBe(false);
            expect(LanguageUtils.isValidLanguage('')).toBe(false);
            expect(LanguageUtils.isValidLanguage('invalid')).toBe(false);
        });

        it('should return false for case-sensitive mismatches', () => {
            expect(LanguageUtils.isValidLanguage('EN')).toBe(false);
            expect(LanguageUtils.isValidLanguage('Es')).toBe(false);
            expect(LanguageUtils.isValidLanguage('FR')).toBe(false);
        });
    });

    describe('validateCharacters', () => {
        describe('English validation', () => {
            it('should validate basic English text', () => {
                expect(LanguageUtils.validateCharacters('Hello World', 'en')).toBe(true);
            });

            it('should validate English with punctuation', () => {
                expect(LanguageUtils.validateCharacters('Hello, World! How are you?', 'en')).toBe(true);
            });

            it('should validate English with apostrophes', () => {
                expect(LanguageUtils.validateCharacters("Don't worry, it's fine.", 'en')).toBe(true);
            });

            it('should validate English with hyphens', () => {
                expect(LanguageUtils.validateCharacters('self-driving car', 'en')).toBe(true);
            });

            it('should reject non-English characters', () => {
                expect(LanguageUtils.validateCharacters('Hello 你好', 'en')).toBe(false);
                expect(LanguageUtils.validateCharacters('Hello 안녕', 'en')).toBe(false);
                expect(LanguageUtils.validateCharacters('Hello مرحبا', 'en')).toBe(false);
            });
        });

        describe('Spanish validation', () => {
            it('should validate basic Spanish text', () => {
                expect(LanguageUtils.validateCharacters('Hola Mundo', 'es')).toBe(true);
            });

            it('should validate Spanish with accents', () => {
                expect(LanguageUtils.validateCharacters('¿Cómo estás? ¡Muy bien!', 'es')).toBe(true);
            });

            it('should validate Spanish with ñ', () => {
                expect(LanguageUtils.validateCharacters('España, niño, año', 'es')).toBe(true);
            });

            it('should validate Spanish with ü', () => {
                expect(LanguageUtils.validateCharacters('pingüino, vergüenza', 'es')).toBe(true);
            });

            it('should reject non-Spanish characters', () => {
                expect(LanguageUtils.validateCharacters('Hola 你好', 'es')).toBe(false);
                expect(LanguageUtils.validateCharacters('Hola 안녕', 'es')).toBe(false);
            });
        });

        describe('French validation', () => {
            it('should validate basic French text', () => {
                expect(LanguageUtils.validateCharacters('Bonjour Monde', 'fr')).toBe(true);
            });

            it('should validate French with accents', () => {
                expect(LanguageUtils.validateCharacters('Comment allez-vous? Très bien!', 'fr')).toBe(true);
            });

            it('should validate French with ç', () => {
                expect(LanguageUtils.validateCharacters('garçon, français', 'fr')).toBe(true);
            });

            it('should validate French with ÿ', () => {
                expect(LanguageUtils.validateCharacters("L'Haÿ-les-Roses", 'fr')).toBe(true);
            });

            it('should reject non-French characters', () => {
                expect(LanguageUtils.validateCharacters('Bonjour 你好', 'fr')).toBe(false);
                expect(LanguageUtils.validateCharacters('Bonjour 안녕', 'fr')).toBe(false);
            });
        });

        describe('Arabic validation', () => {
            it('should validate basic Arabic text', () => {
                expect(LanguageUtils.validateCharacters('مرحبا بالعالم', 'ar')).toBe(true);
            });

            it('should validate Arabic with punctuation', () => {
                expect(LanguageUtils.validateCharacters('كيف حالك؟ بخير!', 'ar')).toBe(true);
            });

            it('should reject non-Arabic characters', () => {
                expect(LanguageUtils.validateCharacters('مرحبا Hello', 'ar')).toBe(false);
                expect(LanguageUtils.validateCharacters('مرحبا 你好', 'ar')).toBe(false);
            });
        });

        describe('Korean validation', () => {
            it('should validate basic Korean text', () => {
                expect(LanguageUtils.validateCharacters('안녕하세요 세계', 'ko')).toBe(true);
            });

            it('should validate Korean with punctuation', () => {
                expect(LanguageUtils.validateCharacters('어떻게 지내세요? 잘 지내요!', 'ko')).toBe(true);
            });

            it('should reject non-Korean characters', () => {
                expect(LanguageUtils.validateCharacters('안녕 Hello', 'ko')).toBe(false);
                expect(LanguageUtils.validateCharacters('안녕 你好', 'ko')).toBe(false);
            });
        });

        it('should handle empty strings', () => {
            expect(LanguageUtils.validateCharacters('', 'en')).toBe(true);
            expect(LanguageUtils.validateCharacters('', 'es')).toBe(true);
            expect(LanguageUtils.validateCharacters('', 'fr')).toBe(true);
            expect(LanguageUtils.validateCharacters('', 'ar')).toBe(true);
            expect(LanguageUtils.validateCharacters('', 'ko')).toBe(true);
        });

        it('should handle whitespace only', () => {
            expect(LanguageUtils.validateCharacters('   ', 'en')).toBe(true);
            expect(LanguageUtils.validateCharacters('\t\n', 'es')).toBe(true);
        });
    });

    describe('getLanguageName', () => {
        it('should return correct language names', () => {
            expect(LanguageUtils.getLanguageName('en')).toBe('English');
            expect(LanguageUtils.getLanguageName('es')).toBe('Spanish');
            expect(LanguageUtils.getLanguageName('fr')).toBe('French');
            expect(LanguageUtils.getLanguageName('ar')).toBe('Arabic');
            expect(LanguageUtils.getLanguageName('ko')).toBe('Korean');
        });

        it('should handle all supported languages', () => {
            const supportedLanguages: SupportedLanguage[] = ['en', 'es', 'fr', 'ar', 'ko'];
            supportedLanguages.forEach(lang => {
                const name = LanguageUtils.getLanguageName(lang);
                expect(typeof name).toBe('string');
                expect(name.length).toBeGreaterThan(0);
            });
        });
    });
}); 
