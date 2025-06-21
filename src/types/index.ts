export interface ValidationResult {
    success: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
    summary: ValidationSummary;
}

export interface ValidationError {
    type: 'error';
    message: string;
    file?: string;
    line?: number;
    column?: number;
    context?: string;
}

export interface ValidationWarning {
    type: 'warning';
    message: string;
    file?: string;
    line?: number;
    column?: number;
    context?: string;
}

export interface ValidationSummary {
    totalFiles: number;
    totalWords: number;
    errors: number;
    warnings: number;
    languages: LanguageSummary[];
}

export interface LanguageSummary {
    language: string;
    files: number;
    words: number;
    errors: number;
    warnings: number;
}

export interface VocabularyWord {
    word: string;
    translation: string;
    definition: string;
    example: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    category?: string;
    phonetic?: string;
    syllables?: string[];
}

export interface VocabularyData {
    metadata: {
        language: string;
        grade: string;
        week: string;
        theme: string;
        version: string;
        lastUpdated: string;
    };
    vocabulary: {
        description: string;
        learningObjectives: string[];
        words: VocabularyWord[];
    };
    activities?: Array<{
        type: string;
        description: string;
        instructions: string;
    }>;
    assessment?: {
        type: string;
        description: string;
        criteria: string[];
    };
}

export interface TranslationComparison {
    englishFile: string;
    targetFile: string;
    language: string;
    missingWords: string[];
    extraWords: string[];
    translationErrors: TranslationError[];
}

export interface TranslationError {
    word: string;
    type: 'missing_translation' | 'empty_translation' | 'same_as_english' | 'missing_definition' | 'missing_example';
    message: string;
}

export interface CLIOptions {
    all?: boolean;
    json?: boolean;
    content?: boolean;
    translations?: boolean;
    languages?: boolean;
    files?: string[];
    output?: 'text' | 'json' | 'markdown';
    verbose?: boolean;
    quiet?: boolean;
    failOnWarnings?: boolean;
}

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'ar' | 'ko';
export type ContentType = 'vocabulary' | 'grammar' | 'spelling';
export type GradeLevel = 'grade-1' | 'grade-2' | 'grade-3' | 'grade-4' | 'grade-5'; 