import * as fs from 'fs';
import * as readline from 'readline';
import * as path from 'path';

export async function readFileLines(dirname: string, filename: string): Promise<string[]> {
    const filePath = path.join(dirname, filename);
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    const lines: string[] = [];

    for await (const line of rl) {
        lines.push(line);
    }

    return lines;
}
