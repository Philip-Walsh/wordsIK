import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export class FileUtils {
    public static fileExists(filePath: string): boolean {
        try {
            return fs.existsSync(filePath);
        } catch {
            return false;
        }
    }

    public static readFile(filePath: string): string {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            throw new Error(`Failed to read file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public static readJsonFile<T>(filePath: string): T {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(content) as T;
        } catch (error) {
            throw new Error(`Failed to read JSON file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public static writeJsonFile<T>(filePath: string, data: T): void {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (error) {
            throw new Error(`Failed to write JSON file ${filePath}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public static async findJsonFiles(pattern: string): Promise<string[]> {
        try {
            return await glob(pattern, { ignore: ['node_modules/**'] });
        } catch (error) {
            throw new Error(`Failed to find files with pattern ${pattern}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public static getJsonFilesInDirectory(dirPath: string): string[] {
        try {
            if (!fs.existsSync(dirPath)) return [];
            return fs.readdirSync(dirPath).filter(file => file.endsWith('.json'));
        } catch (error) {
            return [];
        }
    }

    public static isValidUTF8(text: string): boolean {
        try {
            Buffer.from(text, 'utf8');
            return true;
        } catch {
            return false;
        }
    }

    public static getChangedFiles(baseBranch: string = 'main'): string[] {
        try {
            const { execSync } = require('child_process');
            const output = execSync(`git diff --name-only origin/${baseBranch}...HEAD`, { encoding: 'utf8' });
            return output.split('\n').filter(line => line.trim() && line.endsWith('.json'));
        } catch (error) {
            console.warn('Could not determine changed files, falling back to all files');
            return [];
        }
    }
} 