#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import { ValidationManager } from './ValidationManager';
import { ReportGenerator } from './utils/ReportGenerator';
import { CLIOptions } from './types';

const program = new Command();

const banner = boxen(
    chalk.blue.bold('WordsIK CLI') + '\n' +
    chalk.gray('Multilingual Educational Content Validator'),
    {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'blue'
    }
);

program
    .name('wordsik')
    .description('CLI tool for validating multilingual educational content')
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
    .option('--fail-on-warnings', 'Exit with error code on warnings')
    .action(async (options: CLIOptions) => {
        try {
            const manager = new ValidationManager(options);
            const result = await manager.runValidation();

            const generator = new ReportGenerator(options.output || 'text');
            const report = generator.generateReport(result);

            if (options.output === 'json') {
                console.log(JSON.stringify(result, null, 2));
            } else {
                console.log(report);
            }

            const shouldFail = !result.success || (options.failOnWarnings && result.warnings.length > 0);
            process.exit(shouldFail ? 1 : 0);
        } catch (error) {
            console.error(chalk.red('❌ Validation failed:'), error instanceof Error ? error.message : 'Unknown error');
            process.exit(1);
        }
    });

program
    .command('status')
    .description('Show validation status for all languages')
    .option('-o, --output <format>', 'Output format (text, json, markdown)', 'text')
    .action(async (options: { output: string }) => {
        try {
            const manager = new ValidationManager({ languages: true, output: options.output });
            const result = await manager.runValidation();

            const generator = new ReportGenerator(options.output);
            const report = generator.generateStatusReport(result);

            console.log(report);
        } catch (error) {
            console.error(chalk.red('❌ Status check failed:'), error instanceof Error ? error.message : 'Unknown error');
            process.exit(1);
        }
    });

program
    .command('template')
    .description('Generate translation template')
    .argument('<file>', 'English source file')
    .argument('<language>', 'Target language')
    .option('-o, --output <file>', 'Output file path')
    .action(async (file: string, language: string, options: { output?: string }) => {
        try {
            const manager = new ValidationManager({});
            const template = await manager.generateTranslationTemplate(file, language);

            if (options.output) {
                const fs = require('fs');
                fs.writeFileSync(options.output, JSON.stringify(template, null, 2));
                console.log(chalk.green(`✅ Template saved to ${options.output}`));
            } else {
                console.log(JSON.stringify(template, null, 2));
            }
        } catch (error) {
            console.error(chalk.red('❌ Template generation failed:'), error instanceof Error ? error.message : 'Unknown error');
            process.exit(1);
        }
    });

program.parse();

if (!process.argv.slice(2).length) {
    program.outputHelp();
} 