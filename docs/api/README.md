# WordsIK API Documentation

## Fetching Content Directly from GitHub

WordsIK content is stored as JSON files in the public GitHub repository. You can fetch any file directly using the GitHub raw URL, making it easy to integrate with web apps, scripts, or educational tools.

### How to Construct a Raw GitHub URL

The pattern for any file:

```
https://raw.githubusercontent.com/[username]/[repo]/[branch]/[path/to/file]
```

For the main WordsIK repo:

```
https://raw.githubusercontent.com/wordsik/wordsIK/main/data/vocabulary/en/grade-1/week-1.json
```

### Example: Fetching in the Browser

```js
// Fetch a vocabulary file from GitHub
fetch(
  "https://raw.githubusercontent.com/wordsik/wordsIK/main/data/vocabulary/en/grade-1/week-1.json"
)
  .then((response) => response.json())
  .then((data) => {
    console.log("Theme:", data.vocabulary.theme);
    console.log("Words:", data.vocabulary.words.length);
  });
```

### Example: Fetching in Node.js

```js
const https = require("https");

const url =
  "https://raw.githubusercontent.com/wordsik/wordsIK/main/data/vocabulary/en/grade-1/week-1.json";
https.get(url, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => {
    const json = JSON.parse(data);
    console.log("Theme:", json.vocabulary.theme);
  });
});
```

Or using `node-fetch`:

```js
const fetch = require("node-fetch");

fetch(
  "https://raw.githubusercontent.com/wordsik/wordsIK/main/data/vocabulary/en/grade-1/week-1.json"
)
  .then((res) => res.json())
  .then((json) => console.log(json));
```

### Best Practices & Notes

- **Rate Limits**: GitHub raw URLs are subject to rate limits for unauthenticated requests. For heavy use, consider local mirroring or GitHub API authentication.
- **Always use the `main` branch** (or your target branch) in the URL for the latest content.
- **File Structure**: All content is organized by language, grade, and week. See below for details.

## Switching Between Canonical and Forked Content Sources

By default, all examples use the official WordsIK repository:

```
https://raw.githubusercontent.com/Philip-Walsh/wordsIK/main/...
```

If you fork the repository for your own use, update the base URL in your code to:

```
https://raw.githubusercontent.com/<your-username>/wordsIK/<branch>/...
```

**Tip:** Use a variable or config to easily switch between the official repo and your fork for testing or private use.

### Example: Switching Base URLs

```js
// Set this to the canonical repo or your fork as needed
const BASE_URL = "https://raw.githubusercontent.com/Philip-Walsh/wordsIK/main/";
// For your fork:
// const BASE_URL = "https://raw.githubusercontent.com/your-username/wordsIK/main/";

const filePath = "data/vocabulary/en/grade-1/week-1.json";
fetch(BASE_URL + filePath)
  .then((res) => res.json())
  .then((data) => console.log(data));
```

- **For public/official use:** Always use the canonical repo.
- **For private/custom use:** Use your own fork/branch.
- **For testing:** Use a config or environment variable to switch easily.

---

## Overview

WordsIK provides a simple, programmatic way to access high-quality educational content. This documentation covers how to integrate WordsIK content into your applications, games, and educational tools.

## Quick Start

### Basic Content Access

```javascript
// Load vocabulary content
const fs = require("fs");
const path = require("path");

// Load a vocabulary file
const vocabularyPath = "data/vocabulary/en/grade-1/week-1.json";
const vocabularyData = JSON.parse(fs.readFileSync(vocabularyPath, "utf8"));

console.log(`Theme: ${vocabularyData.theme}`);
console.log(`Words: ${vocabularyData.words.length}`);
```

### Node.js Integration

```javascript
const WordsIK = require("wordsik");

// Initialize with data directory
const wordsik = new WordsIK("./data");

// Get vocabulary for specific language and grade
const vocabulary = wordsik.getVocabulary("en", 1, 1);
console.log(vocabulary.words);

// Get all content for a language
const allContent = wordsik.getAllContent("es");
```

## Data Structure

### Vocabulary Files

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
    "description": "Basic animal vocabulary for grade 1",
    "learningObjectives": [
      "Recognize common animals",
      "Learn animal names in English"
    ],
    "words": [
      {
        "word": "cat",
        "translation": "cat",
        "definition": "A small domesticated carnivorous mammal",
        "example": "The cat is sleeping on the sofa.",
        "difficulty": "easy",
        "category": "animals"
      }
    ]
  }
}
```

### Grammar Files

```json
{
  "metadata": {
    "language": "en",
    "grade": "1",
    "week": "1",
    "theme": "Basic Sentence Structure",
    "version": "1.0"
  },
  "grammar": {
    "description": "Introduction to basic sentence structure",
    "learningObjectives": [
      "Understand sentence capitalization",
      "Learn end punctuation"
    ],
    "rules": [
      {
        "rule": "Capitalization",
        "description": "First letter of sentence must be capitalized",
        "examples": ["The cat is sleeping.", "I like pizza."],
        "practice": ["the dog runs → The dog runs."]
      }
    ]
  }
}
```

### Spelling Files

```json
{
  "metadata": {
    "language": "en",
    "grade": "1",
    "week": "1",
    "theme": "short-vowel-a",
    "version": "1.0"
  },
  "spellingRule": {
    "description": "Words with short 'a' sound",
    "pattern": "CVC (Consonant-Vowel-Consonant)",
    "examples": ["cat", "hat", "mat"],
    "rule": "When a vowel is followed by a consonant, it makes its short sound"
  },
  "words": [
    {
      "word": "cat",
      "phonetic": "/kæt/",
      "syllables": ["cat"],
      "difficulty": "easy",
      "practice": {
        "sentences": ["The cat sat on the mat."],
        "rhymingWords": ["hat", "bat", "rat"]
      }
    }
  ]
}
```

## Content Access Patterns

### File Organization

```
data/
├── vocabulary/
│   ├── en/grade-1/week-1.json
│   ├── es/grade-1/week-1.json
│   └── fr/grade-1/week-1.json
├── grammar/
│   ├── en/grade-1/week-1.json
│   └── es/grade-1/week-1.json
└── spelling/
    ├── en/grade-1/week-1.json
    └── es/grade-1/week-1.json
```

### Content Discovery

```javascript
// Find all available languages
const languages = fs.readdirSync("data/vocabulary");

// Find all grades for a language
const grades = fs.readdirSync(`data/vocabulary/en`);

// Find all weeks for a grade
const weeks = fs.readdirSync(`data/vocabulary/en/grade-1`);
```

## Integration Examples

### Educational Game Integration

```javascript
class VocabularyGame {
  constructor(language, grade, week) {
    this.content = this.loadContent(language, grade, week);
  }

  loadContent(language, grade, week) {
    const path = `data/vocabulary/${language}/grade-${grade}/week-${week}.json`;
    return JSON.parse(fs.readFileSync(path, "utf8"));
  }

  getRandomWord() {
    const words = this.content.vocabulary.words;
    return words[Math.floor(Math.random() * words.length)];
  }

  createFlashcard(word) {
    return {
      front: word.word,
      back: word.translation,
      hint: word.definition,
      example: word.example,
    };
  }
}

// Usage
const game = new VocabularyGame("en", 1, 1);
const flashcard = game.createFlashcard(game.getRandomWord());
```

### Quiz Generator

```javascript
class QuizGenerator {
  constructor(content) {
    this.words = content.vocabulary.words;
  }

  generateMultipleChoice(questionCount = 5) {
    const questions = [];

    for (let i = 0; i < questionCount; i++) {
      const word = this.words[Math.floor(Math.random() * this.words.length)];
      const options = this.generateOptions(word);

      questions.push({
        question: `What is the translation of "${word.word}"?`,
        correctAnswer: word.translation,
        options: options,
        explanation: word.definition,
      });
    }

    return questions;
  }

  generateOptions(correctWord) {
    // Generate 3 incorrect options + 1 correct
    const allWords = this.words.filter(
      (w) => w.translation !== correctWord.translation
    );
    const incorrect = allWords
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map((w) => w.translation);

    const options = [...incorrect, correctWord.translation];
    return options.sort(() => 0.5 - Math.random()); // Shuffle
  }
}
```

### Content Validation

```javascript
class ContentValidator {
  validateVocabulary(content) {
    const errors = [];

    if (!content.metadata) {
      errors.push("Missing metadata");
    }

    if (!content.vocabulary || !content.vocabulary.words) {
      errors.push("Missing vocabulary words");
      return errors;
    }

    content.vocabulary.words.forEach((word, index) => {
      if (!word.word) errors.push(`Word ${index + 1}: Missing word field`);
      if (!word.translation)
        errors.push(`Word ${index + 1}: Missing translation`);
      if (!word.definition)
        errors.push(`Word ${index + 1}: Missing definition`);
      if (!word.example) errors.push(`Word ${index + 1}: Missing example`);
    });

    return errors;
  }
}
```

## Best Practices

### Performance Optimization

```javascript
// Cache frequently accessed content
const contentCache = new Map();

function getCachedContent(language, grade, week) {
  const key = `${language}-${grade}-${week}`;

  if (!contentCache.has(key)) {
    const content = loadContentFromFile(language, grade, week);
    contentCache.set(key, content);
  }

  return contentCache.get(key);
}

// Preload content for better performance
function preloadContent(languages = ["en", "es"], grades = [1, 2]) {
  languages.forEach((lang) => {
    grades.forEach((grade) => {
      for (let week = 1; week <= 10; week++) {
        getCachedContent(lang, grade, week);
      }
    });
  });
}
```

### Error Handling

```javascript
function safeLoadContent(language, grade, week) {
  try {
    const path = `data/vocabulary/${language}/grade-${grade}/week-${week}.json`;

    if (!fs.existsSync(path)) {
      throw new Error(`Content file not found: ${path}`);
    }

    const content = JSON.parse(fs.readFileSync(path, "utf8"));

    // Validate content structure
    if (!content.metadata || !content.vocabulary) {
      throw new Error("Invalid content structure");
    }

    return content;
  } catch (error) {
    console.error(`Failed to load content: ${error.message}`);
    return null;
  }
}
```

### Content Filtering

```javascript
function filterContentByDifficulty(content, difficulty) {
  return {
    ...content,
    vocabulary: {
      ...content.vocabulary,
      words: content.vocabulary.words.filter(
        (word) => word.difficulty === difficulty
      ),
    },
  };
}

function filterContentByCategory(content, category) {
  return {
    ...content,
    vocabulary: {
      ...content.vocabulary,
      words: content.vocabulary.words.filter(
        (word) => word.category === category
      ),
    },
  };
}
```

## Language Support

### Supported Languages

- **English (en)**: Complete vocabulary, grammar, and spelling
- **Spanish (es)**: Complete vocabulary and grammar
- **French (fr)**: Complete vocabulary and grammar
- **Arabic (ar)**: Basic vocabulary (letters and basic words)
- **Korean (ko)**: Basic vocabulary (letters and basic words)

### Language Detection

```javascript
function detectLanguage(text) {
  // Simple language detection based on character sets
  const patterns = {
    arabic: /[\u0600-\u06FF]/,
    korean: /[\uAC00-\uD7AF]/,
    chinese: /[\u4E00-\u9FFF]/,
    japanese: /[\u3040-\u309F\u30A0-\u30FF]/,
  };

  for (const [lang, pattern] of Object.entries(patterns)) {
    if (pattern.test(text)) return lang;
  }

  // Default to English for Latin scripts
  return "en";
}
```

## Content Updates

### Version Management

```javascript
function checkContentUpdates(language, grade, week) {
  const content = loadContent(language, grade, week);
  const lastUpdated = new Date(content.metadata.lastUpdated);
  const now = new Date();

  const daysSinceUpdate = (now - lastUpdated) / (1000 * 60 * 60 * 24);

  if (daysSinceUpdate > 30) {
    console.warn(
      `Content for ${language} grade ${grade} week ${week} is ${Math.floor(
        daysSinceUpdate
      )} days old`
    );
  }

  return content;
}
```

## Troubleshooting

### Common Issues

1. **File Not Found**: Ensure the file path matches the expected structure
2. **Invalid JSON**: Use a JSON validator to check file syntax
3. **Missing Fields**: Verify all required fields are present
4. **Encoding Issues**: Ensure files are saved in UTF-8 encoding

### Debug Mode

```javascript
const DEBUG = process.env.NODE_ENV === "development";

function debugLog(message, data) {
  if (DEBUG) {
    console.log(`[WordsIK Debug] ${message}`, data);
  }
}
```

## Support

For questions, issues, or contributions:

- **GitHub Issues**: Report bugs or request features
- **Documentation**: Check the main README and contributing guides
- **Community**: Join discussions for help and ideas

---

_This API documentation is part of the WordsIK project. For more information, see the main [README](../README.md)._
