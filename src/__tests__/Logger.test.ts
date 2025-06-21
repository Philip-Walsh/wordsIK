import mockLogger from '../__mocks__/Logger';

describe('Logger Mock', () => {
    beforeEach(() => {
        mockLogger.clearCalls();
    });

    describe('basic logging methods', () => {
        it('should track error calls', () => {
            mockLogger.error('Test error message', 'test-context', { error: 'details' });
            expect(mockLogger.getCallCount('error')).toBe(1);
            expect(mockLogger.hasCall('error', 'Test error message')).toBe(true);
            const lastCall = mockLogger.getLastCall();
            expect(lastCall?.method).toBe('error');
            expect(lastCall?.message).toBe('Test error message');
        });

        it('should track info calls', () => {
            mockLogger.info('Test info message', 'info-context');
            expect(mockLogger.getCallCount('info')).toBe(1);
            expect(mockLogger.hasCall('info', 'Test info message')).toBe(true);
        });

        it('should track warn calls', () => {
            mockLogger.warn('Test warning message');
            expect(mockLogger.getCallCount('warn')).toBe(1);
            expect(mockLogger.hasCall('warn', 'Test warning message')).toBe(true);
        });

        it('should track debug calls', () => {
            mockLogger.debug('Test debug message', 'debug-context');
            expect(mockLogger.getCallCount('debug')).toBe(1);
            expect(mockLogger.hasCall('debug', 'Test debug message')).toBe(true);
        });

        it('should track verbose calls', () => {
            mockLogger.verbose('Test verbose message');
            expect(mockLogger.getCallCount('verbose')).toBe(1);
            expect(mockLogger.hasCall('verbose', 'Test verbose message')).toBe(true);
        });
    });

    describe('special logging methods', () => {
        it('should track success calls', () => {
            mockLogger.success('Operation completed successfully');
            expect(mockLogger.getCallCount('success')).toBe(1);
            expect(mockLogger.hasCall('success', 'Operation completed successfully')).toBe(true);
        });

        it('should track progress calls', () => {
            mockLogger.progress('Processing files...');
            expect(mockLogger.getCallCount('progress')).toBe(1);
            expect(mockLogger.hasCall('progress', 'Processing files...')).toBe(true);
        });

        it('should track section calls', () => {
            mockLogger.section('Validation Results');
            expect(mockLogger.getCallCount('section')).toBe(1);
            expect(mockLogger.hasCall('section', 'Validation Results')).toBe(true);
        });

        it('should track subsection calls', () => {
            mockLogger.subsection('JSON Validation');
            expect(mockLogger.getCallCount('subsection')).toBe(1);
            expect(mockLogger.hasCall('subsection', 'JSON Validation')).toBe(true);
        });

        it('should track table calls', () => {
            const headers = ['File', 'Status', 'Errors'];
            const rows = [['test.json', 'PASS', '0']];
            mockLogger.table(headers, rows);
            expect(mockLogger.getCallCount('table')).toBe(1);
            expect(mockLogger.hasCall('table', 'Table with 3 headers and 1 rows')).toBe(true);
            const lastCall = mockLogger.getLastCall();
            expect(lastCall?.data).toEqual({ headers, rows });
        });
    });

    describe('configuration methods', () => {
        it('should track setLevel calls', () => {
            mockLogger.setLevel(2); // INFO level
            expect(mockLogger.getCallCount('setLevel')).toBe(1);
            expect(mockLogger.hasCall('setLevel', 'Log level set to 2')).toBe(true);
            expect(mockLogger.level).toBe(2);
        });

        it('should track setQuiet calls', () => {
            mockLogger.setQuiet(true);
            expect(mockLogger.getCallCount('setQuiet')).toBe(1);
            expect(mockLogger.hasCall('setQuiet', 'Quiet mode set to true')).toBe(true);
            expect(mockLogger.quiet).toBe(true);
        });

        it('should track setVerbose calls', () => {
            mockLogger.setVerbose(true);
            expect(mockLogger.getCallCount('setVerbose')).toBe(1);
            expect(mockLogger.hasCall('setVerbose', 'Verbose mode set to true')).toBe(true);
            expect(mockLogger.isVerbose).toBe(true);
        });
    });

    describe('utility methods', () => {
        it('should get calls by method', () => {
            mockLogger.info('Info 1');
            mockLogger.error('Error 1');
            mockLogger.info('Info 2');
            const infoCalls = mockLogger.getCallsByMethod('info');
            expect(infoCalls).toHaveLength(2);
            expect(infoCalls[0].message).toBe('Info 1');
            expect(infoCalls[1].message).toBe('Info 2');
        });

        it('should get calls by message', () => {
            mockLogger.info('Processing files');
            mockLogger.error('File not found');
            mockLogger.info('Processing complete');
            const processingCalls = mockLogger.getCallsByMessage('Processing');
            expect(processingCalls).toHaveLength(2);
        });

        it('should get last call', () => {
            mockLogger.info('First message');
            mockLogger.error('Last message');
            const lastCall = mockLogger.getLastCall();
            expect(lastCall?.message).toBe('Last message');
        });

        it('should clear calls', () => {
            mockLogger.info('Test message');
            expect(mockLogger.getCallCount()).toBe(1);
            mockLogger.clearCalls();
            expect(mockLogger.getCallCount()).toBe(0);
        });

        it('should check if call exists', () => {
            mockLogger.info('Test message', 'test-context');
            expect(mockLogger.hasCall('info')).toBe(true);
            expect(mockLogger.hasCall('info', 'Test message')).toBe(true);
            expect(mockLogger.hasCall('info', 'Non-existent')).toBe(false);
            expect(mockLogger.hasCall('error')).toBe(false);
        });

        it('should get total call count', () => {
            mockLogger.info('Message 1');
            mockLogger.error('Message 2');
            mockLogger.warn('Message 3');
            expect(mockLogger.getCallCount()).toBe(3);
        });
    });

    describe('timestamp tracking', () => {
        it('should include timestamps in all calls', () => {
            mockLogger.info('Test message');
            const lastCall = mockLogger.getLastCall();
            expect(lastCall?.timestamp).toBeDefined();
            expect(new Date(lastCall!.timestamp)).toBeInstanceOf(Date);
        });
    });
}); 
