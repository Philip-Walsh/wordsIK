// Define LogLevel enum locally to avoid import issues
export enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
    VERBOSE = 4
}

export interface MockLogCall {
    method: string;
    message: string;
    context?: string;
    data?: unknown;
    timestamp: string;
}

export class MockLogger {
    public logCalls: MockLogCall[] = [];
    public level: LogLevel = LogLevel.INFO;
    public quiet: boolean = false;
    public isVerbose: boolean = false;

    // Spy methods that track calls
    public error(message: string, context?: string, data?: unknown): void {
        this.logCalls.push({
            method: 'error',
            message,
            context,
            data,
            timestamp: new Date().toISOString()
        });
    }

    public warn(message: string, context?: string, data?: unknown): void {
        this.logCalls.push({
            method: 'warn',
            message,
            context,
            data,
            timestamp: new Date().toISOString()
        });
    }

    public info(message: string, context?: string, data?: unknown): void {
        this.logCalls.push({
            method: 'info',
            message,
            context,
            data,
            timestamp: new Date().toISOString()
        });
    }

    public debug(message: string, context?: string, data?: unknown): void {
        this.logCalls.push({
            method: 'debug',
            message,
            context,
            data,
            timestamp: new Date().toISOString()
        });
    }

    public verbose(message: string, context?: string, data?: unknown): void {
        this.logCalls.push({
            method: 'verbose',
            message,
            context,
            data,
            timestamp: new Date().toISOString()
        });
    }

    public success(message: string, context?: string): void {
        this.logCalls.push({
            method: 'success',
            message,
            context,
            timestamp: new Date().toISOString()
        });
    }

    public progress(message: string, context?: string): void {
        this.logCalls.push({
            method: 'progress',
            message,
            context,
            timestamp: new Date().toISOString()
        });
    }

    public section(title: string): void {
        this.logCalls.push({
            method: 'section',
            message: title,
            timestamp: new Date().toISOString()
        });
    }

    public subsection(title: string): void {
        this.logCalls.push({
            method: 'subsection',
            message: title,
            context: title,
            timestamp: new Date().toISOString()
        });
    }

    public table(headers: string[], rows: string[][]): void {
        this.logCalls.push({
            method: 'table',
            message: `Table with ${headers.length} headers and ${rows.length} rows`,
            data: { headers, rows },
            timestamp: new Date().toISOString()
        });
    }

    public close(): void {
        this.logCalls.push({
            method: 'close',
            message: 'Logger closed',
            timestamp: new Date().toISOString()
        });
    }

    public setLevel(level: LogLevel): void {
        this.level = level;
        this.logCalls.push({
            method: 'setLevel',
            message: `Log level set to ${level}`,
            data: { level },
            timestamp: new Date().toISOString()
        });
    }

    public setQuiet(quiet: boolean): void {
        this.quiet = quiet;
        this.logCalls.push({
            method: 'setQuiet',
            message: `Quiet mode set to ${quiet}`,
            data: { quiet },
            timestamp: new Date().toISOString()
        });
    }

    public setVerbose(verbose: boolean): void {
        this.isVerbose = verbose;
        this.logCalls.push({
            method: 'setVerbose',
            message: `Verbose mode set to ${verbose}`,
            data: { verbose },
            timestamp: new Date().toISOString()
        });
    }

    // Utility methods for testing
    public getCallsByMethod(method: string): MockLogCall[] {
        return this.logCalls.filter(call => call.method === method);
    }

    public getCallsByMessage(message: string): MockLogCall[] {
        return this.logCalls.filter(call => call.message.includes(message));
    }

    public getLastCall(): MockLogCall | undefined {
        return this.logCalls[this.logCalls.length - 1];
    }

    public clearCalls(): void {
        this.logCalls = [];
    }

    public hasCall(method: string, message?: string): boolean {
        return this.logCalls.some(call =>
            call.method === method &&
            (message === undefined || call.message.includes(message))
        );
    }

    public getCallCount(method?: string): number {
        if (method) {
            return this.getCallsByMethod(method).length;
        }
        return this.logCalls.length;
    }
}

// Create a singleton instance for consistent mocking
export const mockLogger = new MockLogger();

// Export the singleton as the default export for Jest
export default mockLogger; 