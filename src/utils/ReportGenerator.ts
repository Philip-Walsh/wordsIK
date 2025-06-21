import chalk from 'chalk';
import { ValidationResult } from '../types';

export class ReportGenerator {
    private outputFormat: string;

    constructor(outputFormat: string) {
        this.outputFormat = outputFormat;
    }

    public generateReport(result: ValidationResult): string {
        switch (this.outputFormat) {
            case 'json':
                return JSON.stringify(result, null, 2);
            case 'markdown':
                return this.generateMarkdownReport(result);
            default:
                return this.generateTextReport(result);
        }
    }

    public generateStatusReport(result: ValidationResult): string {
        switch (this.outputFormat) {
            case 'json':
                return JSON.stringify(result, null, 2);
            case 'markdown':
                return this.generateMarkdownStatusReport(result);
            default:
                return this.generateTextStatusReport(result);
        }
    }

    private generateTextReport(result: ValidationResult): string {
        let report = `\n${chalk.blue.bold('📊 Validation Report\n\n')}`;

        if (result.success) {
            report += chalk.green('✅ All validations passed!\n\n');
        } else {
            report += chalk.red('❌ Validation failed\n\n');
        }

        if (result.errors.length > 0) {
            report += chalk.red.bold('Errors:\n');
            result.errors.forEach(error => {
                report += chalk.red(`  ❌ ${error.message}\n`);
                if (error.file) report += chalk.gray(`     File: ${error.file}\n`);
                if (error.context) report += chalk.gray(`     Context: ${error.context}\n`);
            });
            report += '\n';
        }

        if (result.warnings.length > 0) {
            report += chalk.yellow.bold('Warnings:\n');
            result.warnings.forEach(warning => {
                report += chalk.yellow(`  ⚠️  ${warning.message}\n`);
                if (warning.file) report += chalk.gray(`     File: ${warning.file}\n`);
                if (warning.context) report += chalk.gray(`     Context: ${warning.context}\n`);
            });
            report += '\n';
        }

        if (result.summary) {
            report += chalk.blue.bold('Summary:\n');
            report += `  Files: ${result.summary.totalFiles}\n`;
            report += `  Words: ${result.summary.totalWords}\n`;
            report += `  Errors: ${result.summary.errors}\n`;
            report += `  Warnings: ${result.summary.warnings}\n`;
        }

        return report;
    }

    private generateMarkdownReport(result: ValidationResult): string {
        let report = '# Validation Report\n\n';

        if (result.success) {
            report += '✅ **All validations passed!**\n\n';
        } else {
            report += '❌ **Validation failed**\n\n';
        }

        if (result.errors.length > 0) {
            report += '## Errors\n\n';
            result.errors.forEach(error => {
                report += `- ❌ ${error.message}\n`;
                if (error.file) report += `  - File: \`${error.file}\`\n`;
                if (error.context) report += `  - Context: ${error.context}\n`;
            });
            report += '\n';
        }

        if (result.warnings.length > 0) {
            report += '## Warnings\n\n';
            result.warnings.forEach(warning => {
                report += `- ⚠️ ${warning.message}\n`;
                if (warning.file) report += `  - File: \`${warning.file}\`\n`;
                if (warning.context) report += `  - Context: ${warning.context}\n`;
            });
            report += '\n';
        }

        if (result.summary) {
            report += '## Summary\n\n';
            report += `- **Files**: ${result.summary.totalFiles}\n`;
            report += `- **Words**: ${result.summary.totalWords}\n`;
            report += `- **Errors**: ${result.summary.errors}\n`;
            report += `- **Warnings**: ${result.summary.warnings}\n`;
        }

        return report;
    }

    private generateTextStatusReport(result: ValidationResult): string {
        let report = `\n${chalk.blue.bold('🌍 Language Status Report\n\n')}`;

        if (result.summary?.languages) {
            for (const lang of result.summary.languages) {
                const status = lang.errors === 0 ? chalk.green('✅') : chalk.red('❌');
                report += `${status} ${lang.language}: ${lang.files} files, ${lang.words} words`;
                if (lang.errors > 0) report += chalk.red(` (${lang.errors} errors)`);
                if (lang.warnings > 0) report += chalk.yellow(` (${lang.warnings} warnings)`);
                report += '\n';
            }
        }

        return report;
    }

    private generateMarkdownStatusReport(result: ValidationResult): string {
        let report = '# Language Status Report\n\n';

        if (result.summary?.languages) {
            report += '| Language | Files | Words | Errors | Warnings | Status |\n';
            report += '|----------|-------|-------|--------|----------|--------|\n';

            for (const lang of result.summary.languages) {
                const status = lang.errors === 0 ? '✅' : '❌';
                report += `| ${lang.language} | ${lang.files} | ${lang.words} | ${lang.errors} | ${lang.warnings} | ${status} |\n`;
            }
        }

        return report;
    }
} 