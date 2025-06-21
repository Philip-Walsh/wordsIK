#!/usr/bin/env node
import fs from 'fs';

import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { ValidationManager } from './ValidationManager.js';
import { ReportGenerator } from './utils/ReportGenerator.js';
import { Logger, LogLevel } from './utils/Logger.js';
import { CLIOptions } from './types/index.js';
import { ReviewGenerator } from './utils/ReviewGenerator.js';

const program = new Command();

const banner = boxen(
    `${chalk.blue.bold('WordsIK CLI')  }\n${ 
    chalk.gray('Multilingual Educational Content Validator')}`,
    {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'blue'
    }
);

program
    .name('wordsik')
    .description('WordsIK CLI for content validation and code review')
    .version('1.0.0')
    .addHelpText('before', banner);

program
    .command('validate')
    .description('Validate content files')
    .option('-a, --all', 'Run all validations')
    .option('-j, --json', 'Validate JSON syntax only')
    .option('-c, --content', 'Validate content appropriateness')
    .option('-t, --translations', 'Validate translations')
    .option('-l, --languages', 'Validate language structure')
    .option('-f, --files <files...>', 'Specific files to validate')
    .option('-o, --output <format>', 'Output format (text, json, markdown)', 'text')
    .option('-v, --verbose', 'Verbose output')
    .option('-q, --quiet', 'Quiet mode (errors only)')
    .option('--debug', 'Enable debug logging')
    .option('--log-file <file>', 'Write logs to file')
    .option('--no-colors', 'Disable colored output')
    .option('--fail-on-warnings', 'Exit with error code on warnings')
    .action(async (options: CLIOptions & { debug?: boolean; logFile?: string; colors?: boolean }) => {
        try {
            // Initialize logger
            const logger = new Logger({
                level: options.debug ? LogLevel.DEBUG : options.verbose ? LogLevel.VERBOSE : LogLevel.INFO,
                quiet: options.quiet,
                verbose: options.verbose,
                logFile: options.logFile,
                colors: options.colors !== false
            });

            logger.section('WordsIK Validation');
            logger.info('Starting validation process', 'CLI');

            const manager = new ValidationManager(options);
            const result = await manager.runValidation();

            const generator = new ReportGenerator(options.output || 'text');
            const report = generator.generateReport(result);

            if (options.output === 'json') {
                logger.info(JSON.stringify(result, null, 2));
            } else {
                logger.info(report);
            }

            const shouldFail = !result.success || (options.failOnWarnings && result.warnings.length > 0);

            if (shouldFail) {
                logger.error('Validation failed', 'CLI', { errors: result.errors.length, warnings: result.warnings.length });
                process.exit(1);
            } else {
                logger.success('Validation completed successfully', 'CLI');
            }

            logger.close();
        } catch (error) {
            const logger = new Logger();
            logger.error('Validation failed', 'CLI', { error: error instanceof Error ? error.message : 'Unknown error' });
            logger.close();
            process.exit(1);
        }
    });

program
    .command('status')
    .description('Show validation status for all languages')
    .option('-o, --output <format>', 'Output format (text, json, markdown)', 'text')
    .option('-v, --verbose', 'Verbose output')
    .option('--debug', 'Enable debug logging')
    .option('--log-file <file>', 'Write logs to file')
    .option('--no-colors', 'Disable colored output')
    .action(async (options: { output: 'text' | 'json' | 'markdown'; verbose?: boolean; debug?: boolean; logFile?: string; colors?: boolean }) => {
        try {
            const logger = new Logger({
                level: options.debug ? LogLevel.DEBUG : options.verbose ? LogLevel.VERBOSE : LogLevel.INFO,
                verbose: options.verbose,
                logFile: options.logFile,
                colors: options.colors !== false
            });

            logger.section('Language Status Check');
            logger.info('Checking language status', 'CLI');

            const manager = new ValidationManager({ languages: true });
            const result = await manager.runValidation();

            const generator = new ReportGenerator(options.output);
            const report = generator.generateStatusReport(result);

            logger.info(report);
            logger.success('Status check completed', 'CLI');
            logger.close();
        } catch (error) {
            const logger = new Logger();
            logger.error('Status check failed', 'CLI', { error: error instanceof Error ? error.message : 'Unknown error' });
            logger.close();
            process.exit(1);
        }
    });

program
    .command('template')
    .description('Generate translation template')
    .argument('<file>', 'English source file')
    .argument('<language>', 'Target language')
    .option('-o, --output <file>', 'Output file path')
    .option('-v, --verbose', 'Verbose output')
    .option('--debug', 'Enable debug logging')
    .option('--log-file <file>', 'Write logs to file')
    .action(async (file: string, language: string, options: { output?: string; verbose?: boolean; debug?: boolean; logFile?: string }) => {
        try {
            const logger = new Logger({
                level: options.debug ? LogLevel.DEBUG : options.verbose ? LogLevel.VERBOSE : LogLevel.INFO,
                verbose: options.verbose,
                logFile: options.logFile
            });

            logger.section('Template Generation');
            logger.info(`Generating template for ${language}`, 'CLI', { sourceFile: file });

            const manager = new ValidationManager({});
            const template = await manager.generateTranslationTemplate(file, language);

            if (options.output) {
                fs.writeFileSync(options.output, JSON.stringify(template, null, 2));
                logger.success(`Template saved to ${options.output}`, 'CLI');
            } else {
                logger.info(JSON.stringify(template, null, 2));
                logger.success('Template generated successfully', 'CLI');
            }

            logger.close();
        } catch (error) {
            const logger = new Logger();
            logger.error('Template generation failed', 'CLI', { error: error instanceof Error ? error.message : 'Unknown error' });
            logger.close();
            process.exit(1);
        }
    });

program
    .command('review')
    .description('Generate code reviews for Cursor with web search integration')
    .option('--files <files...>', 'Files to review (default: all changed files)')
    .option('--output <format>', 'Output format (cursor, markdown, json)', 'cursor')
    .option('--web-search', 'Enable web search for context and best practices')
    .option('--ai-enhanced', 'Use AI to enhance review quality')
    .option('--verbose', 'Verbose output')
    .option('--log-file <file>', 'Log file path')
    .option('--template <template>', 'Review template to use')
    .option('--focus <focus>', 'Focus areas (security, performance, style, docs)')
    .action(async (options) => {
        const reviewGenerator = new ReviewGenerator(new Logger({
            level: options.verbose ? LogLevel.VERBOSE : LogLevel.INFO,
            verbose: options.verbose,
            logFile: options.logFile
        }));
        await reviewGenerator.generateReview(options);
    });

program.parse();

if (!process.argv.slice(2).length) {
    program.outputHelp();
} 