import { createWriteStream, WriteStream } from 'fs';
import chalk from 'chalk';
import { LogData } from '../types/index.js';

export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
    VERBOSE = 4
}

export interface LogOptions {
    level?: LogLevel;
    timestamp?: boolean;
    colors?: boolean;
    logFile?: string;
    quiet?: boolean;
    verbose?: boolean;
}

export interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
    context?: string;
    data?: LogData;
}

export class Logger {
    private level: LogLevel;
    private timestamp: boolean;
    private colors: boolean;
    private logFile?: string;
    private quiet: boolean;
    private isVerbose: boolean;
    private logStream?: WriteStream;

    constructor(options: LogOptions = {}) {
        this.level = options.level || LogLevel.INFO;
        this.timestamp = options.timestamp !== false;
        this.colors = options.colors !== false;
        this.logFile = options.logFile;
        this.quiet = options.quiet || false;
        this.isVerbose = options.verbose || false;

        if (this.logFile) {
            this.initializeLogFile();
        }
    }

    private initializeLogFile(): void {
        try {
            this.logStream = createWriteStream(this.logFile!, { flags: 'a' });
        } catch (error) {
            console.error(`Failed to initialize log file: ${error}`);
        }
    }

    private getTimestamp(): string {
        return new Date().toISOString();
    }

    private getLevelString(level: LogLevel): string {
        switch (level) {
            case LogLevel.ERROR: return 'ERROR';
            case LogLevel.WARN: return 'WARN';
            case LogLevel.INFO: return 'INFO';
            case LogLevel.DEBUG: return 'DEBUG';
            case LogLevel.VERBOSE: return 'VERBOSE';
            default: return 'UNKNOWN';
        }
    }

    private getLevelColor(level: LogLevel): (text: string) => string {
        switch (level) {
            case LogLevel.ERROR: return chalk.red;
            case LogLevel.WARN: return chalk.yellow;
            case LogLevel.INFO: return chalk.blue;
            case LogLevel.DEBUG: return chalk.gray;
            case LogLevel.VERBOSE: return chalk.magenta;
            default: return chalk.white;
        }
    }

    private formatMessage(entry: LogEntry): string {
        let message = '';

        if (this.timestamp) {
            message += `[${entry.timestamp}] `;
        }

        const levelStr = this.getLevelString(entry.level);
        if (this.colors) {
            const colorFn = this.getLevelColor(entry.level);
            message += `${colorFn(levelStr.padEnd(7))} `;
        } else {
            message += `${levelStr.padEnd(7)} `;
        }

        message += entry.message;

        if (entry.context) {
            if (this.colors) {
                message += chalk.gray(` (${entry.context})`);
            } else {
                message += ` (${entry.context})`;
            }
        }

        return message;
    }

    private writeToFile(entry: LogEntry): void {
        if (this.logStream) {
            const logEntry = {
                timestamp: entry.timestamp,
                level: this.getLevelString(entry.level),
                message: entry.message,
                context: entry.context,
                data: entry.data
            };

            this.logStream.write(`${JSON.stringify(logEntry)}\n`);
        }
    }

    private log(level: LogLevel, message: string, context?: string, data?: LogData): void {
        if (level > this.level || this.quiet) {
            return;
        }

        const entry: LogEntry = {
            timestamp: this.getTimestamp(),
            level,
            message,
            context,
            data
        };

        const formattedMessage = this.formatMessage(entry);

        // Write to console
        if (level === LogLevel.ERROR) {
            console.error(formattedMessage);
        } else {
            console.log(formattedMessage);
        }

        // Write to file if configured
        this.writeToFile(entry);

        // Log additional data if provided and verbose mode is enabled
        if (data && this.isVerbose) {
            const dataStr = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
            console.log(chalk.gray(dataStr));
        }
    }

    public error(message: string, context?: string, data?: LogData): void {
        this.log(LogLevel.ERROR, message, context, data);
    }

    public warn(message: string, context?: string, data?: LogData): void {
        this.log(LogLevel.WARN, message, context, data);
    }

    public info(message: string, context?: string, data?: LogData): void {
        this.log(LogLevel.INFO, message, context, data);
    }

    public debug(message: string, context?: string, data?: LogData): void {
        this.log(LogLevel.DEBUG, message, context, data);
    }

    public verbose(message: string, context?: string, data?: LogData): void {
        this.log(LogLevel.VERBOSE, message, context, data);
    }

    public success(message: string, context?: string): void {
        const entry: LogEntry = {
            timestamp: this.getTimestamp(),
            level: LogLevel.INFO,
            message: `✅ ${message}`,
            context
        };

        const formattedMessage = this.formatMessage(entry);
        console.log(chalk.green(formattedMessage));
        this.writeToFile(entry);
    }

    public progress(message: string, context?: string): void {
        const entry: LogEntry = {
            timestamp: this.getTimestamp(),
            level: LogLevel.INFO,
            message: `🔄 ${message}`,
            context
        };

        const formattedMessage = this.formatMessage(entry);
        console.log(chalk.cyan(formattedMessage));
        this.writeToFile(entry);
    }

    public section(title: string): void {
        const separator = '='.repeat(title.length + 4);
        console.log(chalk.blue.bold(`\n${separator}`));
        console.log(chalk.blue.bold(`= ${title} =`));
        console.log(chalk.blue.bold(`${separator}\n`));
    }

    public subsection(title: string): void {
        console.log(chalk.blue.bold(`\n--- ${title} ---\n`));
    }

    public table(headers: string[], rows: string[][]): void {
        if (rows.length === 0) return;

        // Calculate column widths
        const columnWidths = headers.map((header, index) => {
            const maxWidth = Math.max(
                header.length,
                ...rows.map(row => (row[index] || '').length)
            );
            return Math.min(maxWidth, 50); // Cap at 50 characters
        });

        // Print header
        const headerRow = headers.map((header, index) =>
            header.padEnd(columnWidths[index])
        ).join(' | ');
        console.log(chalk.blue.bold(headerRow));

        // Print separator
        const separator = headers.map((_, index) =>
            '-'.repeat(columnWidths[index])
        ).join('-+-');
        console.log(chalk.gray(separator));

        // Print rows
        rows.forEach(row => {
            const formattedRow = row.map((cell, index) =>
                (cell || '').padEnd(columnWidths[index])
            ).join(' | ');
            console.log(formattedRow);
        });
    }

    public close(): void {
        if (this.logStream) {
            this.logStream.end();
        }
    }

    public setLevel(level: LogLevel): void {
        this.level = level;
    }

    public setQuiet(quiet: boolean): void {
        this.quiet = quiet;
    }

    public setVerbose(verbose: boolean): void {
        this.isVerbose = verbose;
    }
}

// Global logger instance
export const logger = new Logger();