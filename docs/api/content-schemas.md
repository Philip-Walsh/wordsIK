# WordsIK Content Schemas

This document provides detailed schema specifications for all content types in WordsIK.

## Table of Contents

- [Vocabulary Schema](#vocabulary-schema)
- [Grammar Schema](#grammar-schema)
- [Spelling Schema](#spelling-schema)
- [Letters Schema](#letters-schema)
- [Common Metadata](#common-metadata)
- [Validation Rules](#validation-rules)

## Vocabulary Schema

### Structure

```json
{
  "metadata": {
    "language": "string (required)",
    "grade": "string (required)",
    "week": "string (required)",
    "theme": "string (required)",
    "version": "string (required)",
    "lastUpdated": "string (required, ISO date)"
  },
  "vocabulary": {
    "description": "string (required)",
    "learningObjectives": ["string array (required)"],
    "words": ["Word object array (required)"]
  }
}
```

### Word Object

```json
{
  "word": "string (required, 1-50 chars)",
  "translation": "string (required, 1-50 chars)",
  "definition": "string (required, 10-200 chars)",
  "example": "string (required, 10-500 chars)",
  "difficulty": "string (optional: 'easy' | 'medium' | 'hard')",
  "category": "string (optional, 1-50 chars)",
  "phonetic": "string (optional, IPA format)",
  "syllables": ["string array (optional)"],
  "tags": ["string array (optional)"]
}
```

### Example

```json
{
  "metadata": {
    "language": "en",
    "grade": "1",
    "week": "1",
    "theme": "Animals",
    "version": "1.0",
    "lastUpdated": "2024-03-20"
  },
  "vocabulary": {
    "description": "Basic animal vocabulary for grade 1 students",
    "learningObjectives": [
      "Recognize common animals",
      "Learn animal names in English",
      "Use animals in simple sentences"
    ],
    "words": [
      {
        "word": "cat",
        "translation": "cat",
        "definition": "A small domesticated carnivorous mammal",
        "example": "The cat is sleeping on the sofa.",
        "difficulty": "easy",
        "category": "animals",
        "phonetic": "/kæt/",
        "syllables": ["cat"],
        "tags": ["pets", "mammals"]
      }
    ]
  }
}
```

## Grammar Schema

### Structure

```json
{
  "metadata": {
    "language": "string (required)",
    "grade": "string (required)",
    "week": "string (required)",
    "theme": "string (required)",
    "version": "string (required)",
    "lastUpdated": "string (required, ISO date)"
  },
  "grammar": {
    "description": "string (required)",
    "learningObjectives": ["string array (required)"],
    "rules": ["GrammarRule object array (required)"]
  },
  "activities": ["Activity object array (optional)"],
  "assessment": "Assessment object (optional)"
}
```

### GrammarRule Object

```json
{
  "rule": "string (required, 1-100 chars)",
  "description": "string (required, 10-500 chars)",
  "examples": ["string array (required, 1-10 items)"],
  "practice": ["string array (optional, 1-10 items)"],
  "exceptions": ["string array (optional)"],
  "difficulty": "string (optional: 'easy' | 'medium' | 'hard')"
}
```

### Activity Object

```json
{
  "type": "string (required: 'sentence-fixing' | 'sentence-building' | 'subject-verb-identification')",
  "description": "string (required)",
  "instructions": "string (required)",
  "materials": ["string array (optional)"],
  "duration": "string (optional, e.g., '15 minutes')"
}
```

### Assessment Object

```json
{
  "type": "string (required: 'application' | 'recognition' | 'production')",
  "description": "string (required)",
  "criteria": ["string array (required)"],
  "rubric": "object (optional)"
}
```

### Example

```json
{
  "metadata": {
    "language": "en",
    "grade": "1",
    "week": "1",
    "theme": "Basic Sentence Structure",
    "version": "1.0",
    "lastUpdated": "2024-03-20"
  },
  "grammar": {
    "description": "Introduction to basic sentence structure and capitalization",
    "learningObjectives": [
      "Understand that sentences begin with capital letters",
      "Learn that sentences end with punctuation",
      "Recognize simple subject-verb structure"
    ],
    "rules": [
      {
        "rule": "Capitalization",
        "description": "The first letter of a sentence must be capitalized",
        "examples": [
          "The cat is sleeping.",
          "I like pizza.",
          "We go to school."
        ],
        "practice": [
          "the dog runs fast → The dog runs fast.",
          "i am happy → I am happy.",
          "she reads books → She reads books."
        ],
        "difficulty": "easy"
      }
    ]
  },
  "activities": [
    {
      "type": "sentence-fixing",
      "description": "Fix sentences with capitalization and punctuation errors",
      "instructions": "Students correct sentences by adding proper capitalization and punctuation",
      "duration": "15 minutes"
    }
  ],
  "assessment": {
    "type": "application",
    "description": "Students should be able to write simple sentences with proper capitalization and punctuation",
    "criteria": [
      "Can capitalize the first letter of sentences",
      "Can add appropriate end punctuation",
      "Can identify subjects and verbs in simple sentences"
    ]
  }
}
```

## Spelling Schema

### Structure

```json
{
  "metadata": {
    "language": "string (required)",
    "grade": "string (required)",
    "week": "string (required)",
    "theme": "string (required)",
    "version": "string (required)",
    "lastUpdated": "string (required, ISO date)"
  },
  "spellingRule": {
    "description": "string (required)",
    "pattern": "string (required)",
    "examples": ["string array (required)"],
    "rule": "string (required)"
  },
  "words": ["SpellingWord object array (required)"],
  "activities": ["Activity object array (optional)"]
}
```

### SpellingWord Object

```json
{
  "word": "string (required, 1-50 chars)",
  "phonetic": "string (optional, IPA format)",
  "syllables": ["string array (optional)"],
  "difficulty": "string (optional: 'easy' | 'medium' | 'hard')",
  "practice": {
    "sentences": ["string array (optional)"],
    "rhymingWords": ["string array (optional)"],
    "wordFamily": ["string array (optional)"]
  }
}
```

### Example

```json
{
  "metadata": {
    "language": "en",
    "grade": "1",
    "week": "1",
    "theme": "short-vowel-a",
    "version": "1.0",
    "lastUpdated": "2024-03-20"
  },
  "spellingRule": {
    "description": "Words with short 'a' sound",
    "pattern": "CVC (Consonant-Vowel-Consonant)",
    "examples": ["cat", "hat", "mat"],
    "rule": "When a vowel is followed by a consonant, it usually makes its short sound"
  },
  "words": [
    {
      "word": "cat",
      "phonetic": "/kæt/",
      "syllables": ["cat"],
      "difficulty": "easy",
      "practice": {
        "sentences": ["The cat sat on the mat.", "I see a black cat."],
        "rhymingWords": ["hat", "bat", "rat"],
        "wordFamily": ["cat", "cats", "catty"]
      }
    }
  ],
  "activities": [
    {
      "type": "word-sort",
      "description": "Sort words by their vowel sound",
      "categories": ["short-a", "other"]
    }
  ]
}
```

## Letters Schema

### Structure

```json
{
  "metadata": {
    "language": "string (required)",
    "grade": "string (required)",
    "week": "string (required, always 'letters')",
    "theme": "string (required)",
    "version": "string (required)",
    "lastUpdated": "string (required, ISO date)"
  },
  "vocabulary": {
    "description": "string (required)",
    "learningObjectives": ["string array (required)"],
    "words": ["Letter object array (required)"]
  }
}
```

### Letter Object

```json
{
  "word": "string (required, single character)",
  "translation": "string (required, phonetic/name)",
  "definition": "string (required, 10-200 chars)",
  "example": "string (required, 10-500 chars)",
  "phonetic": "string (optional, IPA format)",
  "position": "number (optional, alphabet position)"
}
```

### Example

```json
{
  "metadata": {
    "language": "ar",
    "grade": "1",
    "week": "letters",
    "theme": "الحروف الأبجدية (Alphabet)",
    "version": "1.0",
    "lastUpdated": "2024-03-20"
  },
  "vocabulary": {
    "description": "الحروف الأبجدية العربية (Arabic alphabet)",
    "learningObjectives": [
      "تعرف وكتابة جميع الحروف الأبجدية",
      "ممارسة أصوات الحروف"
    ],
    "words": [
      {
        "word": "ا",
        "translation": "alif",
        "definition": "أول حرف في الأبجدية",
        "example": "ا مثل أسد",
        "phonetic": "/ʔalif/",
        "position": 1
      }
    ]
  }
}
```

## Common Metadata

All content files share the same metadata structure:

```json
{
  "language": "string (required)",
  "grade": "string (required)",
  "week": "string (required)",
  "theme": "string (required)",
  "version": "string (required)",
  "lastUpdated": "string (required, ISO date)"
}
```

### Field Descriptions

- **language**: ISO 639-1 language code (e.g., "en", "es", "fr", "ar", "ko")
- **grade**: Grade level as string (e.g., "1", "2", "3", "4", "5")
- **week**: Week identifier or "letters" for alphabet files
- **theme**: Human-readable theme description
- **version**: Semantic version (e.g., "1.0", "1.1")
- **lastUpdated**: ISO 8601 date string (e.g., "2024-03-20")

## Validation Rules

### General Rules

1. **JSON Syntax**: All files must be valid JSON
2. **UTF-8 Encoding**: All files must be saved in UTF-8 encoding
3. **Required Fields**: All required fields must be present and non-empty
4. **Field Lengths**: String fields must respect minimum and maximum lengths
5. **Enum Values**: Fields with specific values must use valid options

### Content Quality Rules

1. **Age Appropriateness**: Content must be suitable for target grade level
2. **Cultural Sensitivity**: Content must be culturally appropriate
3. **Educational Value**: Content must have clear educational purpose
4. **Accuracy**: Translations and definitions must be accurate
5. **Clarity**: Examples must be clear and understandable

### Technical Rules

1. **File Naming**: Files must follow the pattern `week-{number}.json` or `letters.json`
2. **Directory Structure**: Files must be in correct language/grade directories
3. **Character Limits**: Respect maximum character limits for all fields
4. **Array Limits**: Arrays should not exceed reasonable limits (typically 1-50 items)
5. **Date Format**: All dates must be in ISO 8601 format

### Validation Commands

```bash
# Validate all content
npm run validate-all

# Validate specific content types
npm run validate --json
npm run validate --content
npm run validate --translations

# Validate specific files
npm run validate --files data/vocabulary/en/grade-1/week-1.json

# Validate with detailed output
npm run validate --verbose --log-file validation.log
```

## Schema Evolution

### Versioning

- **Major Version**: Breaking changes to schema structure
- **Minor Version**: New optional fields or features
- **Patch Version**: Bug fixes and improvements

### Migration

When schema changes occur:

1. **Backward Compatibility**: Maintain backward compatibility for at least one major version
2. **Migration Tools**: Provide tools to update existing content
3. **Documentation**: Update this schema documentation
4. **Validation**: Update validation rules to handle both old and new formats

### Deprecation

1. **Deprecation Notice**: Mark deprecated fields clearly
2. **Grace Period**: Allow deprecated fields for at least one version
3. **Migration Path**: Provide clear migration instructions
4. **Removal**: Remove deprecated fields in next major version

---

_This schema documentation is part of the WordsIK project. For more information, see the main [README](../README.md)._
