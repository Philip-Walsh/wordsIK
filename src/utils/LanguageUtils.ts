import { SupportedLanguage } from '../types';

export class LanguageUtils {
    private static readonly supportedLanguages: SupportedLanguage[] = ['en', 'es', 'fr', 'ar', 'ko'];
    private static readonly languagePatterns: Record<SupportedLanguage, RegExp> = {
        'en': /^[a-zA-Z\s\-'.,!?]+$/,
        'es': /^[a-zA-ZáéíóúñüÁÉÍÓÚÑÜ\s\-'.,!?]+$/,
        'fr': /^[a-zA-ZàâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ\s\-'.,!?]+$/,
        'ar': /^[\u0600-\u06FF\s\-'.,!?]+$/, // Arabic Unicode range
        'ko': /^[\uAC00-\uD7AF\s\-'.,!?]+$/ // Korean Unicode range
    };

    public static extractLanguageFromPath(filePath: string): string | null {
        const pathParts = filePath.split('/');
        const languageIndex = pathParts.findIndex(part => this.supportedLanguages.includes(part as SupportedLanguage));
        return languageIndex !== -1 ? pathParts[languageIndex] : null;
    }

    public static isValidLanguage(language: string): language is SupportedLanguage {
        return this.supportedLanguages.includes(language as SupportedLanguage);
    }

    public static validateCharacters(text: string, language: SupportedLanguage): boolean {
        const pattern = this.languagePatterns[language];
        return pattern.test(text);
    }

    public static getLanguageName(language: SupportedLanguage): string {
        const names: Record<SupportedLanguage, string> = {
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'ar': 'Arabic',
            'ko': 'Korean'
        };
        return names[language];
    }
} 