import mongoose from 'mongoose';
import { logger } from '../utils/logger';

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
    if (isConnected) {
        logger.info('MongoDB is already connected');
        return;
    }

    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/magikast';

        logger.info(`Attempting to connect to MongoDB: ${mongoUri}`);

        // Set mongoose options
        mongoose.set('strictQuery', false);

        const connection = await mongoose.connect(mongoUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            bufferCommands: false,
        });

        isConnected = true;
        logger.info(`MongoDB connected successfully to: ${connection.connection.host}`);

        // Connection event handlers
        mongoose.connection.on('error', (error) => {
            logger.error('MongoDB connection error:', error);
            isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
            isConnected = false;
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB reconnected');
            isConnected = true;
        });

    } catch (error) {
        logger.error('Failed to connect to MongoDB:', error);
        isConnected = false;
        throw error;
    }
};

export const disconnectDatabase = async (): Promise<void> => {
    if (!isConnected) return;

    await mongoose.disconnect();
    isConnected = false;
    logger.info('MongoDB disconnected');
};

// Health check for database
export const isDatabaseConnected = (): boolean => {
    return isConnected && mongoose.connection.readyState === 1;
};