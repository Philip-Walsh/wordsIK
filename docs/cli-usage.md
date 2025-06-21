# WordsIK CLI Usage Guide

## Installation and Setup

```bash
# Install dependencies
npm install

# Build the TypeScript CLI
npm run build

# Verify installation
npm run status
```

## Quick Start

### Basic Validation

```bash
# Validate all content
npm run validate-all

# Validate specific types
npm run validate --json
npm run validate --content
npm run validate --translations
npm run validate --languages

# Validate with logging
npm run validate-verbose
npm run validate-debug
```

### Status and Information

```bash
# Show repository status
npm run status

# Detailed status with logging
npm run status-verbose
```

## NPM Scripts Reference

### Validation Scripts

```bash
# Basic validation
npm run validate

# Full validation with all checks
npm run validate-all

# Validation with debug logging
npm run validate-debug

# Validation with verbose logging
npm run validate-verbose

# CI-optimized validation
npm run validate-ci
```

### Development Scripts

```bash
# Build TypeScript
npm run build

# Watch mode for development
npm run dev

# Run tests
npm test
npm run test:watch
npm run test:coverage
npm run test:ci

# Linting
npm run lint:ts
npm run lint:fix
npm run lint:all
```

### Log Management

```bash
# Clean log files
npm run logs:clean

# View all logs
npm run logs:view

# Tail logs in real-time
npm run logs:tail
```

### Cleanup Scripts

```bash
# Clean build artifacts and logs
npm run clean

# Full cleanup including node_modules
npm run clean:all
```

## Direct CLI Usage

### Basic Commands

```bash
# Validate all content
npm start validate --all

# Validate specific types
npm start validate --json
npm start validate --content
npm start validate --translations
npm start validate --languages

# Validate specific files
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

## Logging Options

### Log Levels

```bash
# Info level (default)
npm start validate --all

# Verbose output
npm start validate --all --verbose

# Debug logging
npm start validate --all --debug

# Quiet mode (errors only)
npm start validate --all --quiet
```

### Log File Output

```bash
# Write logs to file
npm start validate --all --log-file validation.log

# Disable colored output
npm start validate --all --no-colors

# Combined options
npm start validate --all --verbose --log-file logs/validation.log --no-colors
```

### Status Check with Logging

```bash
npm start status --verbose --log-file status.log
```

## Advanced Features

### Error Handling

```bash
# Exit with error code on warnings
npm start validate --all --fail-on-warnings

# Continue on warnings (default)
npm start validate --all
```

### Template Generation

```bash
# Generate translation template
npm start template data/vocabulary/en/grade-1/week-1.json es

# Save template to file
npm start template data/vocabulary/en/grade-1/week-1.json es --output template.json

# Verbose template generation
npm start template data/vocabulary/en/grade-1/week-1.json es --verbose
```

## CI/CD Integration

The CLI is automatically used in GitHub Actions for:

- JSON validation
- Content appropriateness checks
- Translation validation
- Language structure validation

### CI/CD Usage

```yaml
# In GitHub Actions workflow
- name: Validate with logging
  run: |
    npm run validate-ci
    npm run test:ci
```

### CI/CD Logging

```yaml
# In GitHub Actions workflow
- name: Validate with logging
  run: |
    npm start validate --all --verbose --log-file ci-validation.log
    npm start validate --translations --log-file ci-translations.log
```

## Development Workflow

### Daily Development

```bash
# Start development session
npm run dev

# In another terminal, run validation
npm run validate-verbose

# Check status
npm run status
```

### Pre-commit Workflow

```bash
# Run all checks before commit
npm run lint:all
npm run test
npm run validate-all

# Or use the pre-commit hook (automatic)
git add .
git commit -m "Your commit message"
```

### Debugging Issues

```bash
# Enable debug logging
npm run validate-debug

# Check specific files
npm start validate --files path/to/file.json --verbose

# Analyze logs
npm run logs:view
npm run logs:tail
```

## Logging System

### Log Levels

- **ERROR**: Critical errors that prevent operation
- **WARN**: Non-critical issues that should be addressed
- **INFO**: General information about the process
- **DEBUG**: Detailed debugging information
- **VERBOSE**: Very detailed information for troubleshooting

### Log Output

- **Console**: Colored output with timestamps
- **File**: JSON-structured logs for analysis
- **Context**: File paths and operation context
- **Data**: Additional structured data in verbose mode

### Log Format

```
[2024-03-21T10:30:45.123Z] INFO    Starting validation process (CLI)
[2024-03-21T10:30:45.124Z] INFO    Running all validations (ValidationManager)
[2024-03-21T10:30:45.125Z] SUCCESS JSON validation completed (ValidationManager)
```

### Log File Format (JSON)

```json
{
  "timestamp": "2024-03-21T10:30:45.123Z",
  "level": "INFO",
  "message": "Starting validation process",
  "context": "CLI",
  "data": null
}
```

## Validation Types

### 1. JSON Validation

- Checks syntax and UTF-8 encoding
- Validates JSON structure
- Ensures proper formatting

### 2. Content Validation

- Profanity filtering
- Content quality checks
- Age-appropriate content validation

### 3. Translation Validation

- Consistency between language versions
- Translation completeness
- Cultural appropriateness

### 4. Language Validation

- Language-specific characters
- Character encoding validation
- Structure validation

## Output Formats

### Text Output

- Human-readable with colors
- Progress indicators
- Clear error messages
- Summary statistics

### JSON Output

- Machine-readable structured data
- Detailed validation results
- Error locations and context
- Performance metrics

### Markdown Output

- GitHub-compatible formatted reports
- Structured validation results
- Easy to read and share
- CI/CD friendly

## Error Handling

### Error Types

- **Critical Errors**: Prevent operation completion
- **Warnings**: Non-critical issues
- **Info Messages**: General information
- **Debug Info**: Detailed debugging data

### Error Context

- File paths and line numbers
- Validation type and context
- Suggested fixes
- Related documentation

### Exit Codes

- **0**: Success
- **1**: General error
- **2**: Validation errors
- **3**: Configuration errors

## Performance Features

### Incremental Validation

- Only processes changed files
- Efficient file discovery
- Parallel processing where possible
- Memory-conscious operations

### Caching

- Validation result caching
- File modification tracking
- Performance optimization
- Resource management

## Troubleshooting

### Common Issues

1. **Build Errors**:

   ```bash
   npm run clean
   npm run build
   ```

2. **Validation Failures**:

   ```bash
   npm run validate-debug
   npm run logs:view
   ```

3. **Log Issues**:
   ```bash
   npm run logs:clean
   npm run validate-verbose
   ```

### Getting Help

```bash
# CLI help
npm start --help
npm start validate --help

# Check version
npm start --version

# Debug mode
npm run validate-debug
```

## Examples

### Complete Validation Workflow

```bash
# 1. Build the CLI
npm run build

# 2. Check status
npm run status

# 3. Run full validation with logging
npm run validate-verbose -- --log-file logs/full-validation.log

# 4. Check results
npm run logs:view

# 5. Run tests
npm test

# 6. Lint code
npm run lint:all
```

### Development Session

```bash
# Terminal 1: Watch mode
npm run dev

# Terminal 2: Validation
npm run validate-verbose

# Terminal 3: Log monitoring
npm run logs:tail
```

### CI/CD Pipeline

```bash
# Build and test
npm run build
npm run test:ci
npm run validate-ci

# Generate reports
npm start validate --all --output json > validation-report.json
npm start validate --all --output markdown > validation-report.md
```
