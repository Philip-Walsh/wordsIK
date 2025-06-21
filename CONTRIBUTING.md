# Contributing to WordsIK

Thank you for your interest in contributing to WordsIK! This repository is designed to provide high-quality educational vocabulary and grammar content for multiple languages. We welcome contributions from teachers, linguists, and educational content creators.

## Table of Contents

- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Content Guidelines](#content-guidelines)
- [Multi-Language Support](#multi-language-support)
- [Quality Standards](#quality-standards)
- [Development Setup](#development-setup)
- [Code of Conduct](#code-of-conduct)

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/wordsIK.git
   cd wordsIK
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a new branch** for your contribution:
   ```bash
   git checkout -b feature/add-new-vocabulary
   ```

## How to Contribute

### Adding New Vocabulary

1. **Choose the appropriate directory structure**:

   ```
   data/vocabulary/[language]/[grade-level]/
   ```

2. **Follow the existing JSON structure** (see `templates/vocabulary-template.json`):

   ```json
   {
     "week": "1",
     "theme": "Animals",
     "words": [
       {
         "word": "cat",
         "translation": "gato",
         "definition": "A small domesticated carnivorous mammal",
         "example": "The cat is sleeping on the sofa.",
         "difficulty": "easy",
         "category": "animals"
       }
     ]
   }
   ```

3. **Run validation locally**:

   ```bash
   npm run validate
   ```

4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "Add new vocabulary for Spanish Grade 1 - Animals"
   ```

5. **Push and create a Pull Request**

### Adding Grammar Content

1. **Navigate to the grammar directory**:

   ```
   data/grammar/[language]/[grade-level]/
   ```

2. **Create structured grammar lessons** with clear examples and exercises

### Adding Spelling Content

1. **Use the spelling directory structure**:

   ```
   data/spelling/[language]/[grade-level]/
   ```

2. **Follow the existing format** (see `data/spelling/en/grade-1/week-1.json`)

## Content Guidelines

### General Principles

- **Age-appropriate content**: Ensure all content is suitable for the target grade level
- **Educational value**: Focus on words and concepts that enhance learning
- **Cultural sensitivity**: Be mindful of cultural differences and avoid stereotypes
- **Accuracy**: Verify translations and definitions with native speakers when possible

### File Naming Conventions

- Use lowercase with hyphens: `week-1.json`, `animals-theme.json`
- Include language and grade in directory structure
- Use descriptive names that indicate content type

### JSON Structure Requirements

- All JSON files must be valid and well-formatted
- Include required fields: `week`, `theme`, `words`
- Each word should have: `word`, `translation`, `definition`, `example`
- Optional fields: `difficulty`, `category`, `notes`

## Multi-Language Support

### Language Validation

When contributing content in languages other than English:

1. **Native Speaker Review**: Have content reviewed by native speakers
2. **Cultural Context**: Ensure examples and contexts are culturally appropriate
3. **Regional Variations**: Note if content is specific to certain regions/dialects
4. **Character Encoding**: Use UTF-8 encoding for all files

### Supported Languages

Currently supported languages:

- English (en)
- Arabic (ar)
- Korean (ko)
- Spanish (es)
- French (fr)

To add a new language:

1. Create the language directory structure
2. Add language metadata to `lang-data.json`
3. Provide sample content for validation
4. Update this documentation

### Translation Guidelines

- **Literal vs. Contextual**: Provide both literal and contextual translations
- **Formal vs. Informal**: Specify the register (formal/informal) when relevant
- **Regional Variations**: Include regional variations when significant
- **Pronunciation**: Include pronunciation guides for non-Latin scripts

## Quality Standards

### Automated Checks

All contributions are automatically checked for:

1. **Profanity Filter**: Content is scanned for inappropriate language
2. **Spell Checking**: Spelling errors are flagged
3. **Grammar Linting**: Vale checks for writing quality and style
4. **Secret Detection**: Prevents accidental commit of sensitive information
5. **JSON Validation**: Ensures proper JSON formatting

### Manual Review Process

1. **Content Review**: Educational content is reviewed by teachers
2. **Cultural Review**: Content is reviewed for cultural sensitivity
3. **Technical Review**: Code and structure are reviewed by maintainers

### Quality Checklist

Before submitting a pull request, ensure:

- [ ] Content is age-appropriate for the target grade
- [ ] All translations are accurate and culturally appropriate
- [ ] Examples are clear and educational
- [ ] JSON files are properly formatted
- [ ] No sensitive information is included
- [ ] Content follows the established structure
- [ ] Local validation passes (`npm run validate`)

## Development Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Local Development

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up pre-commit hooks** (automatically configured):

   ```bash
   npm run prepare
   ```

3. **Run validation**:
   ```bash
   npm run validate
   ```

### Testing Your Changes

1. **Validate JSON structure**:

   ```bash
   node validation/profanity-check.js path/to/your/file.json
   ```

2. **Check for spelling errors**:

   ```bash
   # Install and run spell checker
   npm install -g cspell
   cspell "data/**/*.json"
   ```

3. **Run Vale linting** (if installed):
   ```bash
   vale docs/
   ```

## Code of Conduct

### Our Standards

We are committed to providing a welcoming and inspiring community for all. We expect all contributors to:

- Be respectful and inclusive
- Focus on educational value
- Provide constructive feedback
- Respect cultural differences
- Maintain professional behavior

### Reporting Issues

If you experience or witness unacceptable behavior, please report it to the project maintainers.

## Getting Help

- **Issues**: Use GitHub Issues for bug reports and feature requests
- **Discussions**: Use GitHub Discussions for questions and general discussion
- **Documentation**: Check the `docs/` directory for detailed guides

## Recognition

Contributors will be recognized in:

- The project README
- Release notes
- Contributor hall of fame

Thank you for contributing to WordsIK and helping make educational content more accessible to students worldwide!
