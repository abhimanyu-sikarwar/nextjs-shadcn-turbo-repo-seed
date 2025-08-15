import sharp from 'sharp';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../utils/logger';

export class StorageService {
    private localStoragePath: string;

    constructor() {
        this.localStoragePath = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
        this.localStoragePath = path.resolve(this.localStoragePath);
        if (!fs.existsSync(this.localStoragePath)) {
            fs.mkdirSync(this.localStoragePath, { recursive: true });
        }
    }

    /**
     * Download an image from a URL and save it as a .png
     */
    async storeImage(imageUrl: string, key: string): Promise<string> {
        try {
            const response = await axios.get(imageUrl, {
                responseType: 'arraybuffer'
            });
            const buffer = Buffer.from(response.data);
            const fileName = key.endsWith(path.extname(key)) ? key : `${key}.png`;
            return this.saveToLocal(buffer, fileName);
        } catch (error) {
            logger.error('Failed to store image:', error);
            throw new Error('Failed to store image');
        }
    }

    /**
     * Generate a JPEG thumbnail from an image URL or local upload path
     */
    async generateThumbnail(
        imageUrl: string,
        width: number,
        height: number
    ): Promise<string> {
        try {
            let buffer: Buffer;

            // Download or read from local
            if (imageUrl.startsWith('http')) {
                const response = await axios.get(imageUrl, {
                    responseType: 'arraybuffer'
                });
                buffer = Buffer.from(response.data);
            } else {
                const relativePath = imageUrl.replace(/^\/uploads\//, '');
                const filePath = path.join(this.localStoragePath, relativePath);
                buffer = await fs.promises.readFile(filePath);
            }

            // Resize and convert to JPEG
            const thumbnailBuffer = await sharp(buffer)
                .resize(width, height, { fit: 'cover', position: 'center' })
                .jpeg({ quality: 85 })
                .toBuffer();

            const thumbKey = imageUrl
                .replace(/^\/uploads\//, '')
                .replace(/\.(jpg|jpeg|png|webp)$/i, '_thumb.jpg');

            return this.saveToLocal(thumbnailBuffer, thumbKey);
        } catch (error) {
            logger.error('Failed to generate thumbnail:', error);
            throw new Error('Failed to generate thumbnail');
        }
    }

    /**
     * Save a raw Buffer as a file under uploads
     */
    async storeBuffer(buffer: Buffer, key: string): Promise<string> {
        try {
            const fileName = key.endsWith(path.extname(key)) ? key : `${key}.png`;
            return this.saveToLocal(buffer, fileName);
        } catch (error) {
            logger.error('Failed to store buffer:', error);
            throw new Error('Failed to store buffer');
        }
    }

    /**
     * Generate a JPEG thumbnail directly from a Buffer
     */
    async generateThumbnailFromBuffer(
        buffer: Buffer,
        key: string,
        width: number,
        height: number
    ): Promise<string> {
        try {
            const thumbBuffer = await sharp(buffer)
                .resize(width, height, { fit: 'cover', position: 'center' })
                .jpeg({ quality: 85 })
                .toBuffer();

            const thumbKey = key.endsWith(path.extname(key)) ? key : `${key}`;
            return this.saveToLocal(thumbBuffer, thumbKey);
        } catch (error) {
            logger.error('Failed to generate thumbnail from buffer:', error);
            throw new Error('Failed to generate thumbnail from buffer');
        }
    }

    /**
     * Internal helper: write buffer to disk and return a public path
     */
    private async saveToLocal(buffer: Buffer, key: string): Promise<string> {
        const filePath = path.join(this.localStoragePath, key);
        const dir = path.dirname(filePath);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        await fs.promises.writeFile(filePath, buffer);
        return `/uploads/${key}`;
    }

    /**
     * Delete a file by its storage key
     */
    async deleteImage(key: string): Promise<void> {
        try {
            const filePath = path.join(this.localStoragePath, key);
            if (fs.existsSync(filePath)) {
                await fs.promises.unlink(filePath);
            }
        } catch (error) {
            logger.error('Failed to delete image:', error);
        }
    }
}
