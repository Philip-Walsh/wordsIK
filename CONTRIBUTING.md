# Contributing to WordsIK

Thank you for your interest in contributing to WordsIK! This repository is designed to provide high-quality educational vocabulary and grammar content for multiple languages. We welcome contributions from teachers, linguists, and educational content creators.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Content Guidelines](#content-guidelines)
- [Multi-Language Support](#multi-language-support)
- [Quality Standards](#quality-standards)
- [CLI Development](#cli-development)
- [Testing and Validation](#testing-and-validation)
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
4. **Build the CLI**:
   ```bash
   npm run build
   ```
5. **Create a new branch** for your contribution:
   ```bash
   git checkout -b feature/add-new-vocabulary
   ```

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Git

### Local Development

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Build the TypeScript CLI**:

   ```bash
   npm run build
   ```

3. **Set up pre-commit hooks** (automatically configured):

   ```bash
   npm run prepare
   ```

4. **Verify installation**:
   ```bash
   npm run status
   ```

### Development Scripts

The project includes comprehensive npm scripts for development:

```bash
# Build and validation
npm run build                    # Build TypeScript
npm run dev                      # Watch mode for development
npm run validate                 # Basic validation
npm run validate-all            # Full validation with all checks
npm run validate-debug          # Validation with debug logging
npm run validate-verbose        # Validation with verbose logging
npm run validate-ci             # CI-optimized validation

# Status and information
npm run status                  # Show repository status
npm run status-verbose          # Detailed status with logging
npm run template                # Generate vocabulary templates

# Testing and quality
npm run test                    # Run tests
npm run test:watch              # Watch mode for tests
npm run test:coverage           # Tests with coverage
npm run test:ci                 # CI-optimized tests

# Linting and formatting
npm run lint:ts                 # TypeScript linting
npm run lint:fix                # Auto-fix linting issues
npm run lint:all                # All linting checks

# Log management
npm run logs:clean              # Clean log files
npm run logs:view               # View all logs
npm run logs:tail               # Tail logs in real-time

# Cleanup
npm run clean                   # Clean build artifacts
npm run clean:all               # Full cleanup
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

3. **Validate your content locally**:

   ```bash
   # Basic validation
   npm run validate

   # Full validation with logging
   npm run validate-verbose -- --log-file logs/my-validation.log

   # Debug validation for troubleshooting
   npm run validate-debug
   ```

4. **Check status and quality**:

   ```bash
   npm run status
   npm run lint:all
   npm run test
   ```

5. **Commit your changes**:

   ```bash
   git add .
   git commit -m "Add new vocabulary for Spanish Grade 1 - Animals"
   ```

6. **Push and create a Pull Request**

### Adding Grammar Content

1. **Navigate to the grammar directory**:

   ```
   data/grammar/[language]/[grade-level]/
   ```

2. **Create structured grammar lessons** with clear examples and exercises

3. **Validate grammar content**:
   ```bash
   npm run validate -- --content
   ```

### Adding Spelling Content

1. **Use the spelling directory structure**:

   ```
   data/spelling/[language]/[grade-level]/
   ```

2. **Follow the existing format** (see `data/spelling/en/grade-1/week-1.json`)

3. **Validate spelling content**:
   ```bash
   npm run validate -- --content --verbose
   ```

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

1. **JSON Validation**: Syntax and UTF-8 encoding validation
2. **Content Validation**: Profanity filtering and content quality checks
3. **Translation Validation**: Consistency between language versions
4. **Language Validation**: Language-specific characters and structure
5. **Spell Checking**: Spelling errors in documentation
6. **Grammar Linting**: Vale checks for writing quality and style
7. **Secret Detection**: Prevents accidental commit of sensitive information

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
- [ ] Local validation passes (`npm run validate-all`)
- [ ] All tests pass (`npm test`)
- [ ] Linting passes (`npm run lint:all`)
- [ ] Logs are clean and informative

## CLI Development

### Architecture

The CLI is built with TypeScript and follows a modular architecture:

- **CLI Entry Point**: `src/cli.ts` - Main command interface
- **Validation Manager**: `src/ValidationManager.ts` - Orchestrates validation
- **Validators**: `src/validators/` - Individual validation modules
- **Utilities**: `src/utils/` - Shared utilities and logging
- **Types**: `src/types/` - TypeScript type definitions

### Adding New Validators

1. **Create validator class** extending `BaseValidator`:

   ```typescript
   export class MyValidator extends BaseValidator {
     async validate(filePath: string): Promise<ValidationResult> {
       // Implementation
     }
   }
   ```

2. **Register in ValidationManager**:

   ```typescript
   this.validators.push(new MyValidator(this.logger));
   ```

3. **Add CLI options** in `cli.ts`:
   ```typescript
   .option('--my-validation', 'Run my custom validation')
   ```

### Logging System

The CLI includes a comprehensive logging system:

```typescript
// Log levels: ERROR, WARN, INFO, DEBUG, VERBOSE
logger.error("Critical error occurred");
logger.warn("Warning about potential issue");
logger.info("General information");
logger.debug("Debug information");
logger.verbose("Very detailed information");
```

### CLI Usage Examples

```bash
# Basic validation
npm start validate

# Full validation with logging
npm start validate --all --verbose --log-file logs/validation.log

# Specific validation types
npm start validate --content --translations

# Status check
npm start status --verbose

# Template generation
npm start template data/vocabulary/en/grade-1/week-1.json es
```

## Testing and Validation

### Running Tests

```bash
# All tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# CI mode
npm run test:ci
```

### Validation Workflow

```bash
# Development validation
npm run validate-debug

# Pre-commit validation
npm run validate-verbose

# CI validation
npm run validate-ci
```

### Log Analysis

```bash
# View logs
npm run logs:view

# Tail logs
npm run logs:tail

# Clean logs
npm run logs:clean
```

### Debugging

1. **Enable debug logging**:

   ```bash
   npm run validate-debug
   ```

2. **Check specific files**:

   ```bash
   npm start validate --files path/to/file.json --verbose
   ```

3. **Analyze logs**:
   ```bash
   npm run logs:view
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
- **CLI Help**: Run `npm start --help` for CLI usage information

## Recognition

Contributors will be recognized in:

- The project README
- Release notes
- Contributor hall of fame

Thank you for contributing to WordsIK and helping make educational content more accessible to students worldwide!
