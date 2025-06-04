
// src/lib/json-utils.ts
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const dataDirectory = path.join(process.cwd(), 'src', 'data');

export function readJsonFile<T>(filename: string): T[] {
  const filePath = path.join(dataDirectory, filename);
  try {
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContents) as T[];
    }
    return [];
  } catch (error) {
    console.error(`Error reading JSON file ${filename}:`, error);
    return [];
  }
}

export function writeJsonFile<T>(filename: string, data: T[]): boolean {
  const filePath = path.join(dataDirectory, filename);
  try {
    const jsonData = JSON.stringify(data, null, 2); // Pretty print JSON
    fs.writeFileSync(filePath, jsonData, 'utf8');
    return true;
  } catch (error) {
    console.error(`Error writing JSON file ${filename}:`, error);
    return false;
  }
}

export function generateId(): string {
  return uuidv4();
}
