# WordsIK Developer Guide

This guide provides comprehensive information for developers working on the WordsIK project, including architecture, development workflow, and technical implementation details.

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Development Environment](#development-environment)
- [Code Structure](#code-structure)
- [CLI System](#cli-system)
- [Validation System](#validation-system)
- [Logging System](#logging-system)
- [Testing Strategy](#testing-strategy)
- [CI/CD Pipeline](#cicd-pipeline)
- [Performance Considerations](#performance-considerations)
- [Troubleshooting](#troubleshooting)

## Project Overview

WordsIK is a multilingual educational vocabulary repository that provides high-quality content for multiple languages with robust validation and quality assurance systems.

### Key Features

- **Multilingual Support**: English, Spanish, French, Arabic, Korean
- **Content Validation**: JSON, content quality, translation consistency
- **CLI Tools**: TypeScript-based command-line interface
- **Logging System**: Comprehensive logging with multiple levels
- **CI/CD Integration**: Automated validation and testing
- **Quality Assurance**: Profanity filtering, cultural sensitivity checks

### Technology Stack

- **Language**: TypeScript/Node.js
- **CLI Framework**: Commander.js
- **Logging**: Custom logging system with file and console output
- **Testing**: Jest with TypeScript support
- **Linting**: ESLint with TypeScript rules
- **CI/CD**: GitHub Actions

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CLI Layer     │    │ Validation      │    │   Data Layer    │
│   (cli.ts)      │◄──►│   Manager       │◄──►│   (data/*.json) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Utilities     │    │   Validators    │    │   Templates     │
│   (utils/*.ts)  │    │ (validators/*)  │    │ (templates/*)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Responsibilities

1. **CLI Layer**: Command parsing, user interaction, output formatting
2. **Validation Manager**: Orchestrates validation processes
3. **Validators**: Individual validation logic for different content types
4. **Utilities**: Shared functionality (logging, file operations, etc.)
5. **Data Layer**: JSON content files organized by language and grade

## Development Environment

### Prerequisites

- Node.js v18 or higher
- npm v8 or higher
- Git
- VS Code (recommended) with TypeScript extensions

### Setup

```bash
# Clone repository
git clone https://github.com/your-username/wordsIK.git
cd wordsIK

# Install dependencies
npm install

# Build TypeScript
npm run build

# Verify setup
npm run status
```

### Development Scripts

```bash
# Development workflow
npm run dev              # Watch mode for TypeScript
npm run validate-verbose # Full validation with logging
npm run test:watch       # Watch mode for tests
npm run logs:tail        # Monitor logs in real-time

# Quality checks
npm run lint:all         # All linting checks
npm run test:coverage    # Tests with coverage
npm run validate-all     # Complete validation

# Cleanup
npm run clean            # Clean build artifacts
npm run logs:clean       # Clean log files
```

## Code Structure

### Directory Organization

```
src/
├── cli.ts                    # CLI entry point
├── ValidationManager.ts      # Validation orchestration
├── types/
│   └── index.ts             # TypeScript type definitions
├── utils/
│   ├── Logger.ts            # Logging system
│   ├── FileUtils.ts         # File operations
│   ├── LanguageUtils.ts     # Language-specific utilities
│   └── ReportGenerator.ts   # Report generation
└── validators/
    ├── BaseValidator.ts     # Base validator class
    ├── JsonValidator.ts     # JSON validation
    ├── ContentValidator.ts  # Content quality validation
    ├── TranslationValidator.ts # Translation consistency
    └── LanguageValidator.ts # Language-specific validation

data/
├── vocabulary/              # Vocabulary content
├── grammar/                 # Grammar content
└── spelling/                # Spelling content

docs/
├── cli-usage.md            # CLI documentation
├── guides/                 # Developer guides
└── api/                    # API documentation

validation/                 # Legacy validation scripts
templates/                  # Content templates
```

### TypeScript Configuration

The project uses strict TypeScript configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

## CLI System

### Architecture

The CLI is built using Commander.js with a modular structure:

```typescript
// cli.ts - Main entry point
import { Command } from "commander";
import { ValidationManager } from "./ValidationManager";
import { Logger } from "./utils/Logger";

const program = new Command();
const logger = new Logger();

program
  .name("wordsik")
  .description("WordsIK CLI for content validation")
  .version("1.0.0");

program
  .command("validate")
  .description("Validate content files")
  .option("--all", "Run all validations")
  .option("--json", "Validate JSON syntax only")
  .option("--content", "Validate content quality")
  .option("--translations", "Validate translations")
  .option("--languages", "Validate language structure")
  .option("--verbose", "Verbose output")
  .option("--debug", "Debug logging")
  .option("--log-file <file>", "Log file path")
  .action(async (options) => {
    const manager = new ValidationManager(logger);
    await manager.validate(options);
  });
```

### Command Structure

1. **validate**: Main validation command

   - `--all`: Run all validation types
   - `--json`: JSON syntax validation
   - `--content`: Content quality validation
   - `--translations`: Translation consistency
   - `--languages`: Language structure validation

2. **status**: Repository status

   - `--verbose`: Detailed status with logging

3. **template**: Template generation
   - Source file and target language parameters

### Output Formats

- **Text**: Human-readable with colors and progress indicators
- **JSON**: Machine-readable structured data
- **Markdown**: GitHub-compatible formatted reports

## Validation System

### Validation Architecture

```typescript
// Base validator interface
abstract class BaseValidator {
  protected logger: Logger;

  constructor(logger: Logger) {
    this.logger = logger;
  }

  abstract validate(filePath: string): Promise<ValidationResult>;
}

// Validation result structure
interface ValidationResult {
  success: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  filePath: string;
  validationType: string;
  duration: number;
}
```

### Validator Types

1. **JsonValidator**: JSON syntax and UTF-8 encoding
2. **ContentValidator**: Profanity filtering and content quality
3. **TranslationValidator**: Translation consistency across languages
4. **LanguageValidator**: Language-specific character validation

### Validation Process

```typescript
// ValidationManager orchestrates the process
class ValidationManager {
  private validators: BaseValidator[];

  async validate(options: ValidationOptions): Promise<ValidationReport> {
    this.logger.info("Starting validation process");

    const files = await this.discoverFiles(options);
    const results = await Promise.all(
      files.map((file) => this.validateFile(file, options))
    );

    return this.generateReport(results);
  }
}
```

## Logging System

### Log Levels

- **ERROR**: Critical errors that prevent operation
- **WARN**: Non-critical issues that should be addressed
- **INFO**: General information about the process
- **DEBUG**: Detailed debugging information
- **VERBOSE**: Very detailed information for troubleshooting

### Logger Implementation

```typescript
class Logger {
  private level: LogLevel;
  private logFile?: string;
  private useColors: boolean;

  log(level: LogLevel, message: string, context?: string, data?: any): void {
    if (this.shouldLog(level)) {
      this.writeToConsole(level, message, context, data);
      this.writeToFile(level, message, context, data);
    }
  }

  private writeToConsole(
    level: LogLevel,
    message: string,
    context?: string
  ): void {
    const timestamp = new Date().toISOString();
    const color = this.getColorForLevel(level);
    const output = `[${timestamp}] ${level.padEnd(7)} ${message} ${
      context ? `(${context})` : ""
    }`;

    if (this.useColors) {
      console.log(color(output));
    } else {
      console.log(output);
    }
  }
}
```

### Log File Format

```json
{
  "timestamp": "2024-03-21T10:30:45.123Z",
  "level": "INFO",
  "message": "Starting validation process",
  "context": "CLI",
  "data": {
    "files": ["file1.json", "file2.json"],
    "options": { "all": true, "verbose": true }
  }
}
```

## Testing Strategy

### Test Structure

```
src/__tests__/
├── ValidationManager.test.ts
├── validators/
│   ├── JsonValidator.test.ts
│   ├── ContentValidator.test.ts
│   └── TranslationValidator.test.ts
└── utils/
    ├── Logger.test.ts
    └── FileUtils.test.ts
```

### Test Configuration

```javascript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/cli.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
};
```

### Testing Patterns

```typescript
// Example test structure
describe("ValidationManager", () => {
  let manager: ValidationManager;
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger();
    manager = new ValidationManager(logger);
  });

  describe("validate", () => {
    it("should validate all files when --all option is used", async () => {
      const options = { all: true };
      const result = await manager.validate(options);

      expect(result.success).toBe(true);
      expect(result.filesProcessed).toBeGreaterThan(0);
    });
  });
});
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/validate.yml
name: Validate Content

on:
  pull_request:
    paths:
      - "data/**"
      - "src/**"
      - "package.json"

jobs:
  validate:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build CLI
        run: npm run build

      - name: Run validation
        run: npm run validate-ci

      - name: Run tests
        run: npm run test:ci

      - name: Upload validation logs
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: validation-logs
          path: logs/*.log
```

### Validation Stages

1. **Pre-commit**: Lint-staged runs basic validation
2. **Pull Request**: Full validation and testing
3. **Merge**: Final validation before merge
4. **Release**: Comprehensive validation and testing

## Performance Considerations

### Optimization Strategies

1. **Incremental Validation**: Only process changed files
2. **Parallel Processing**: Use Promise.all for independent operations
3. **File Caching**: Cache validation results
4. **Memory Management**: Stream large files when possible
5. **Efficient File Discovery**: Use glob patterns for file matching

### Performance Monitoring

```typescript
// Performance tracking in validators
class BaseValidator {
  protected async measurePerformance<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    const start = Date.now();
    try {
      const result = await operation();
      const duration = Date.now() - start;
      this.logger.debug(`${operationName} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.error(`${operationName} failed after ${duration}ms`, error);
      throw error;
    }
  }
}
```

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

3. **Test Failures**:

   ```bash
   npm run test:coverage
   npm run lint:all
   ```

4. **Log Issues**:
   ```bash
   npm run logs:clean
   npm run validate-verbose
   ```

### Debug Workflow

1. **Enable Debug Logging**:

   ```bash
   npm run validate-debug
   ```

2. **Check Specific Files**:

   ```bash
   npm start validate --files path/to/file.json --verbose
   ```

3. **Analyze Logs**:

   ```bash
   npm run logs:view
   npm run logs:tail
   ```

4. **Run Tests**:
   ```bash
   npm run test:watch
   ```

### Getting Help

- **CLI Help**: `npm start --help`
- **Validation Help**: `npm start validate --help`
- **Logs**: Check `logs/` directory for detailed information
- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Use GitHub Discussions for questions

## Contributing Guidelines

### Code Style

- Use TypeScript strict mode
- Follow ESLint configuration
- Write comprehensive tests
- Add JSDoc comments for public APIs
- Use meaningful variable and function names

### Pull Request Process

1. **Create Feature Branch**: `git checkout -b feature/your-feature`
2. **Make Changes**: Follow coding standards
3. **Add Tests**: Ensure good test coverage
4. **Run Validation**: `npm run validate-all`
5. **Update Documentation**: Update relevant docs
6. **Submit PR**: Include detailed description

### Review Process

1. **Automated Checks**: CI/CD pipeline validation
2. **Code Review**: Maintainer review
3. **Testing**: Manual testing if needed
4. **Documentation**: Ensure docs are updated
5. **Merge**: Approved changes are merged

This developer guide provides a comprehensive overview of the WordsIK project architecture and development workflow. For specific implementation details, refer to the source code and API documentation.
