# WordsIK CLI Usage Guide

## Installation

```bash
npm install
npm run build
```

## Basic Usage

### Validate All Content

```bash
npm start validate --all
```

### Validate Specific Types

```bash
# JSON syntax only
npm start validate --json

# Content appropriateness (profanity check)
npm start validate --content

# Translation consistency
npm start validate --translations

# Language structure
npm start validate --languages
```

### Validate Specific Files

```bash
npm start validate --files data/vocabulary/es/grade-1/week-1.json
```

### Output Formats

```bash
# Text output (default)
npm start validate --all

# JSON output
npm start validate --all --output json

# Markdown output
npm start validate --all --output markdown
```

### Verbose Mode

```bash
npm start validate --all --verbose
```

### Status Check

```bash
npm start status
```

## CI/CD Integration

The CLI is automatically used in GitHub Actions for:

- JSON validation
- Content appropriateness checks
- Translation validation
- Language structure validation

## Development

```bash
# Build TypeScript
npm run build

# Watch mode
npm run dev

# Lint
npm run lint:ts

# Test
npm test
```

## Features

### Validation Types

1. **JSON Validation**: Checks syntax and UTF-8 encoding
2. **Content Validation**: Profanity filtering and content quality checks
3. **Translation Validation**: Ensures consistency between language versions
4. **Language Validation**: Validates language-specific characters and structure

### Output Formats

- **Text**: Human-readable output with colors
- **JSON**: Machine-readable structured data
- **Markdown**: GitHub-compatible formatted reports

### Error Handling

- Clear error messages with file locations
- Warnings for non-critical issues
- Configurable exit codes
- Verbose mode for debugging
