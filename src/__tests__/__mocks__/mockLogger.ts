// Shared mock logger for all tests
export const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    section: jest.fn(),
    subsection: jest.fn(),
    progress: jest.fn(),
    success: jest.fn(),
    setVerbose: jest.fn(),
    close: jest.fn(),
    hasCall: jest.fn().mockReturnValue(false),
    clearCalls: jest.fn()
};

// Reset all mock functions
export const resetMockLogger = () => {
    Object.values(mockLogger).forEach(fn => {
        if (typeof fn === 'function' && fn.mockClear) {
            fn.mockClear();
        }
    });
}; 