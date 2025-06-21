import { FileUtils } from '../utils/FileUtils';

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { glob } from 'glob';

// Mock fs module
jest.mock('fs');
jest.mock('child_process');
jest.mock('glob');
jest.mock('../utils/Logger', () => ({
    logger: {
        warn: jest.fn(),
        error: jest.fn(),
        info: jest.fn(),
        debug: jest.fn(),
        verbose: jest.fn(),
        success: jest.fn(),
        progress: jest.fn(),
        section: jest.fn(),
        subsection: jest.fn(),
        table: jest.fn(),
        close: jest.fn(),
        setLevel: jest.fn(),
        setQuiet: jest.fn(),
        setVerbose: jest.fn()
    }
}));

const mockFs = fs as jest.Mocked<typeof fs>;
const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockGlob = glob as jest.MockedFunction<typeof glob>;

describe('FileUtils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fileExists', () => {
        it('should return true when file exists', () => {
            mockFs.existsSync.mockReturnValue(true);
            expect(FileUtils.fileExists('test.json')).toBe(true);
            expect(mockFs.existsSync).toHaveBeenCalledWith('test.json');
        });

        it('should return false when file does not exist', () => {
            mockFs.existsSync.mockReturnValue(false);
            expect(FileUtils.fileExists('nonexistent.json')).toBe(false);
        });

        it('should return false when fs.existsSync throws an error', () => {
            mockFs.existsSync.mockImplementation(() => {
                throw new Error('Permission denied');
            });
            expect(FileUtils.fileExists('test.json')).toBe(false);
        });
    });

    describe('readFile', () => {
        it('should read file content successfully', () => {
            const content = '{"test": "data"}';
            (mockFs.readFileSync as jest.Mock).mockReturnValue(content);
            const result = FileUtils.readFile('test.json');
            expect(result).toBe(content);
            expect(mockFs.readFileSync).toHaveBeenCalledWith('test.json', 'utf8');
        });

        it('should throw error when file read fails', () => {
            const error = new Error('File not found');
            mockFs.readFileSync.mockImplementation(() => {
                throw error;
            });
            expect(() => FileUtils.readFile('test.json')).toThrow('Failed to read file test.json: File not found');
        });
    });

    describe('readJsonFile', () => {
        it('should parse JSON file successfully', () => {
            const jsonContent = '{"name": "test", "value": 123}';
            (mockFs.readFileSync as jest.Mock).mockReturnValue(jsonContent);
            const result = FileUtils.readJsonFile('test.json');
            expect(result).toEqual({ name: 'test', value: 123 });
        });

        it('should throw error when JSON parsing fails', () => {
            const invalidJson = '{"invalid": json}';
            (mockFs.readFileSync as jest.Mock).mockReturnValue(invalidJson);
            expect(() => FileUtils.readJsonFile('test.json')).toThrow('Failed to read JSON file test.json');
        });

        it('should throw error when file read fails', () => {
            mockFs.readFileSync.mockImplementation(() => {
                throw new Error('Permission denied');
            });
            expect(() => FileUtils.readJsonFile('test.json')).toThrow('Failed to read JSON file test.json: Permission denied');
        });
    });

    describe('writeJsonFile', () => {
        it('should write JSON file successfully', () => {
            const data = { name: 'test', value: 123 };
            FileUtils.writeJsonFile('test.json', data);
            expect(mockFs.mkdirSync).toHaveBeenCalledWith(path.dirname('test.json'), { recursive: true });
            expect(mockFs.writeFileSync).toHaveBeenCalledWith('test.json', JSON.stringify(data, null, 2), 'utf8');
        });

        it('should not create directory if it already exists', () => {
            const data = { name: 'test' };
            mockFs.existsSync.mockReturnValue(true);
            FileUtils.writeJsonFile('test.json', data);
            expect(mockFs.mkdirSync).not.toHaveBeenCalled();
            expect(mockFs.writeFileSync).toHaveBeenCalled();
        });

        it('should throw error when write fails', () => {
            const data = { name: 'test' };
            mockFs.writeFileSync.mockImplementation(() => {
                throw new Error('Disk full');
            });
            expect(() => FileUtils.writeJsonFile('test.json', data)).toThrow('Failed to write JSON file test.json: Disk full');
        });
    });

    describe('findJsonFiles', () => {
        it('should find JSON files using glob pattern', async () => {
            const expectedFiles = ['data/en/vocabulary.json', 'data/es/vocabulary.json'];
            mockGlob.mockResolvedValue(expectedFiles);
            const result = await FileUtils.findJsonFiles('data/**/*.json');
            expect(result).toEqual(expectedFiles);
            expect(mockGlob).toHaveBeenCalledWith('data/**/*.json', { ignore: ['node_modules/**'] });
        });

        it('should throw error when glob fails', async () => {
            mockGlob.mockRejectedValue(new Error('Pattern error'));
            await expect(FileUtils.findJsonFiles('invalid/**/*.json')).rejects.toThrow('Failed to find files with pattern invalid/**/*.json: Pattern error');
        });
    });

    describe('getJsonFilesInDirectory', () => {
        it('should return JSON files from directory', () => {
            const files = ['file1.json', 'file2.txt', 'file3.json', 'file4.md'];
            mockFs.existsSync.mockReturnValue(true);
            (mockFs.readdirSync as jest.Mock).mockReturnValue(files);
            const result = FileUtils.getJsonFilesInDirectory('test-dir');
            expect(result).toEqual(['file1.json', 'file3.json']);
            expect(mockFs.readdirSync).toHaveBeenCalledWith('test-dir');
        });

        it('should return empty array when directory does not exist', () => {
            mockFs.existsSync.mockReturnValue(false);
            const result = FileUtils.getJsonFilesInDirectory('nonexistent-dir');
            expect(result).toEqual([]);
            expect(mockFs.readdirSync).not.toHaveBeenCalled();
        });

        it('should return empty array when readdir fails', () => {
            mockFs.existsSync.mockReturnValue(true);
            mockFs.readdirSync.mockImplementation(() => {
                throw new Error('Permission denied');
            });
            const result = FileUtils.getJsonFilesInDirectory('test-dir');
            expect(result).toEqual([]);
        });
    });

    describe('isValidUTF8', () => {
        it('should return true for valid UTF-8 text', () => {
            const validText = 'Hello World 你好 안녕하세요';
            expect(FileUtils.isValidUTF8(validText)).toBe(true);
        });

        it('should return true for empty string', () => {
            expect(FileUtils.isValidUTF8('')).toBe(true);
        });

        it('should return true for ASCII text', () => {
            expect(FileUtils.isValidUTF8('Hello World')).toBe(true);
        });
    });

    describe('getChangedFiles', () => {
        it('should return changed JSON files from git', () => {
            const gitOutput = 'data/en/vocabulary.json\ndata/es/vocabulary.json\nREADME.md';
            (mockExecSync as jest.Mock).mockReturnValue(gitOutput);
            const result = FileUtils.getChangedFiles('main');
            expect(result).toEqual(['data/en/vocabulary.json', 'data/es/vocabulary.json']);
            expect(mockExecSync).toHaveBeenCalledWith('git diff --name-only origin/main...HEAD', { encoding: 'utf8' });
        });

        it('should return empty array when no JSON files changed', () => {
            const gitOutput = 'README.md\npackage.json\nsrc/index.ts';
            (mockExecSync as jest.Mock).mockReturnValue(gitOutput);
            const result = FileUtils.getChangedFiles('main');
            expect(result).toEqual(['package.json']);
        });

        it('should return empty array when git command fails', () => {
            mockExecSync.mockImplementation(() => {
                throw new Error('Not a git repository');
            });
            const result = FileUtils.getChangedFiles('main');
            expect(result).toEqual([]);
        });

        it('should use default branch when not specified', () => {
            const gitOutput = 'data/test.json';
            (mockExecSync as jest.Mock).mockReturnValue(gitOutput);
            const result = FileUtils.getChangedFiles();
            expect(result).toEqual(['data/test.json']);
            expect(mockExecSync).toHaveBeenCalledWith('git diff --name-only origin/main...HEAD', { encoding: 'utf8' });
        });
    });
}); 
