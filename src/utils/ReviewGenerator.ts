import { Logger } from './Logger.js';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

export interface ReviewOptions {
    files?: string[];
    output?: 'cursor' | 'markdown' | 'json';
    webSearch?: boolean;
    aiEnhanced?: boolean;
    verbose?: boolean;
    logFile?: string;
    template?: string;
    focus?: string;
}

export interface ReviewResult {
    file: string;
    issues: ReviewIssue[];
    suggestions: string[];
    score: number;
    summary: string;
}

export interface ReviewIssue {
    type: 'error' | 'warning' | 'info' | 'suggestion';
    line?: number;
    message: string;
    code?: string;
    suggestion?: string;
    severity: 'high' | 'medium' | 'low';
}

export class ReviewGenerator {
    private logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
    }

    async generateReview(options: ReviewOptions): Promise<void> {
        this.logger.info('Starting code review generation');

        try {
            // Get files to review
            const files = await this.getFilesToReview(options.files);
            this.logger.info(`Reviewing ${files.length} files`);

            // Generate reviews for each file
            const reviews: ReviewResult[] = [];
            for (const file of files) {
                const review = await this.reviewFile(file, options);
                reviews.push(review);
            }

            // Generate output
            await this.generateOutput(reviews, options);

            this.logger.success('Code review generation completed');
        } catch (error) {
            this.logger.error('Failed to generate code review', 'ReviewGenerator', { error: error instanceof Error ? error.message : 'Unknown error' });
            throw error;
        }
    }

    private async getFilesToReview(specifiedFiles?: string[]): Promise<string[]> {
        if (specifiedFiles && specifiedFiles.length > 0) {
            return specifiedFiles;
        }

        // Get changed files from git
        try {
            const output = execSync('git diff --name-only HEAD~1', { encoding: 'utf8' });
            const files = output.trim().split('\n').filter(f => f.length > 0);

            // Filter for relevant file types
            return files.filter(file =>
                file.endsWith('.ts') ||
                file.endsWith('.js') ||
                file.endsWith('.json') ||
                file.endsWith('.md') ||
                file.endsWith('.yml') ||
                file.endsWith('.yaml')
            );
        } catch {
            this.logger.warn('Could not get changed files from git, using all files');
            return []; // Return empty array for now
        }
    }

    private async reviewFile(file: string, options: ReviewOptions): Promise<ReviewResult> {
        this.logger.info(`Reviewing file: ${file}`, 'ReviewGenerator');

        const content = readFileSync(file, 'utf8');
        const issues: ReviewIssue[] = [];
        const suggestions: string[] = [];

        // Basic code review checks
        await this.performBasicChecks(file, content, issues, suggestions);

        // Web search enhanced checks
        if (options.webSearch) {
            await this.performWebSearchChecks(file, content, issues, suggestions);
        }

        // AI enhanced checks
        if (options.aiEnhanced) {
            await this.performAIChecks(file, content, issues, suggestions);
        }

        // Calculate score
        const score = this.calculateScore(issues);

        // Generate summary
        const summary = this.generateSummary(issues, suggestions);

        return {
            file,
            issues,
            suggestions,
            score,
            summary
        };
    }

    private async performBasicChecks(
        file: string,
        content: string,
        issues: ReviewIssue[],
        suggestions: string[]
    ): Promise<void> {
        // Security checks
        if (content.includes('password') || content.includes('secret') || content.includes('api_key')) {
            issues.push({
                type: 'warning',
                message: 'Potential sensitive data found',
                severity: 'high',
                suggestion: 'Consider using environment variables or secure configuration management'
            });
        }

        // Performance checks
        if (content.includes('for (let i = 0; i < array.length; i++)')) {
            suggestions.push('Consider using forEach, map, or for...of for better readability');
        }

        // Code style checks
        if (content.includes('console.log(') && !file.includes('.test.')) {
            issues.push({
                type: 'warning',
                message: 'Console.log found in production code',
                severity: 'medium',
                suggestion: 'Remove or replace with proper logging'
            });
        }

        // Documentation checks
        if (file.endsWith('.ts') && !content.includes('/**') && !content.includes('//')) {
            suggestions.push('Consider adding JSDoc comments for better documentation');
        }

        // Error handling checks
        if (content.includes('async') && !content.includes('try') && !content.includes('catch')) {
            suggestions.push('Consider adding error handling for async operations');
        }
    }

    private async performWebSearchChecks(
        file: string,
        content: string,
        issues: ReviewIssue[],
        suggestions: string[]
    ): Promise<void> {
        // This would integrate with web search APIs
        // For now, we'll add some common best practices
        this.logger.info('Performing web search enhanced checks', 'ReviewGenerator');

        // TypeScript best practices
        if (file.endsWith('.ts')) {
            if (content.includes('any')) {
                suggestions.push('Consider using specific types instead of "any" for better type safety');
            }

            if (content.includes('require(')) {
                suggestions.push('Consider using ES6 import/export syntax for better tree-shaking');
            }
        }

        // React best practices (if applicable)
        if (content.includes('useState') || content.includes('useEffect')) {
            suggestions.push('Consider using React.memo for performance optimization');
        }

        // Node.js best practices
        if (content.includes('fs.readFileSync')) {
            suggestions.push('Consider using async/await with fs.promises for better performance');
        }
    }

    private async performAIChecks(
        file: string,
        content: string,
        issues: ReviewIssue[],
        suggestions: string[]
    ): Promise<void> {
        // This would integrate with AI APIs for enhanced analysis
        // For now, we'll add some intelligent suggestions
        this.logger.info('Performing AI enhanced checks', 'ReviewGenerator');

        // Complexity analysis
        const lines = content.split('\n');
        if (lines.length > 200) {
            suggestions.push('Consider breaking down large files into smaller, focused modules');
        }

        // Function length analysis
        const functionMatches = content.match(/function\s+\w+\s*\(/g);
        if (functionMatches && functionMatches.length > 10) {
            suggestions.push('Consider reducing the number of functions or grouping related functionality');
        }
    }

    private calculateScore(issues: ReviewIssue[]): number {
        let score = 100;

        for (const issue of issues) {
            switch (issue.severity) {
                case 'high':
                    score -= 20;
                    break;
                case 'medium':
                    score -= 10;
                    break;
                case 'low':
                    score -= 5;
                    break;
            }
        }

        return Math.max(0, score);
    }

    private generateSummary(issues: ReviewIssue[], suggestions: string[]): string {
        const highIssues = issues.filter(i => i.severity === 'high').length;
        const mediumIssues = issues.filter(i => i.severity === 'medium').length;
        const lowIssues = issues.filter(i => i.severity === 'low').length;

        return `Found ${issues.length} issues (${highIssues} high, ${mediumIssues} medium, ${lowIssues} low) and ${suggestions.length} suggestions`;
    }

    private async generateOutput(reviews: ReviewResult[], options: ReviewOptions): Promise<void> {
        switch (options.output) {
            case 'cursor':
                await this.generateCursorOutput(reviews);
                break;
            case 'markdown':
                await this.generateMarkdownOutput(reviews);
                break;
            case 'json':
                await this.generateJsonOutput(reviews);
                break;
            default:
                await this.generateCursorOutput(reviews);
        }
    }

    private async generateCursorOutput(reviews: ReviewResult[]): Promise<void> {
        const cursorReview = this.formatForCursor(reviews);
        this.logger.info(`\n${'='.repeat(80)}`);
        this.logger.info('CURSOR CODE REVIEW');
        this.logger.info(`${'='.repeat(80)}`);
        this.logger.info(cursorReview);
    }

    private formatForCursor(reviews: ReviewResult[]): string {
        let output = '';

        for (const review of reviews) {
            output += `\n## ${review.file}\n\n`;
            output += `**Score:** ${review.score}/100\n\n`;
            output += `**Summary:** ${review.summary}\n\n`;

            if (review.issues.length > 0) {
                output += '### Issues\n\n';
                for (const issue of review.issues) {
                    output += `- **${issue.severity.toUpperCase()}**: ${issue.message}\n`;
                    if (issue.suggestion) {
                        output += `  - 💡 **Suggestion**: ${issue.suggestion}\n`;
                    }
                    if (issue.line) {
                        output += `  - 📍 **Line**: ${issue.line}\n`;
                    }
                    output += '\n';
                }
            }

            if (review.suggestions.length > 0) {
                output += '### Suggestions\n\n';
                for (const suggestion of review.suggestions) {
                    output += `- 💡 ${suggestion}\n`;
                }
                output += '\n';
            }
        }

        return output;
    }

    private async generateMarkdownOutput(reviews: ReviewResult[]): Promise<void> {
        const markdown = this.formatForCursor(reviews);
        writeFileSync('code-review.md', markdown);
        this.logger.success('Markdown review saved to code-review.md');
    }

    private async generateJsonOutput(reviews: ReviewResult[]): Promise<void> {
        writeFileSync('code-review.json', JSON.stringify(reviews, null, 2));
        this.logger.success('JSON review saved to code-review.json');
    }
} 