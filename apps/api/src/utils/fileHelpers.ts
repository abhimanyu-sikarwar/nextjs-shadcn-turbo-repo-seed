import * as fs from 'fs';
import * as path from 'path';

export class FileHelpers {
    static ensureDirectoryExists(dirPath: string): void {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    }

    static generateFilename(): string {
        const timestamp = new Date().toISOString()
            .replace(/[-:]/g, '')
            .replace(/\.\d{3}Z$/, '')
            .replace('T', '_');
        return `output_${timestamp}.wav`;
    }

    static saveAudioFile(audioContent: Buffer, filename: string, downloadPath: string = './downloads'): string {
        this.ensureDirectoryExists(downloadPath);
        const filepath = path.join(downloadPath, filename);
        fs.writeFileSync(filepath, audioContent);
        return filepath;
    }
}
