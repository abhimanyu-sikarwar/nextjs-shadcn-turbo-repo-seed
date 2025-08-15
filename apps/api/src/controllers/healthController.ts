import { Request, Response } from 'express';
import { BaseController } from './baseController';
import { isDatabaseConnected } from '../config/database';
import mongoose from 'mongoose';

export class HealthController extends BaseController {
    checkHealth = async (req: Request, res: Response): Promise<void> => {
        try {
            const dbStatus = isDatabaseConnected();
            const dbPing = await this.checkDatabasePing();

            const health = {
                status: dbStatus && dbPing ? 'OK' : 'DEGRADED',
                timestamp: new Date().toISOString(),
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                version: process.version,
                services: {
                    api: 'operational',
                    database: {
                        connected: dbStatus,
                        ping: dbPing,
                        state: mongoose.connection.readyState,
                        host: mongoose.connection.host || 'not connected'
                    }
                }
            };

            const statusCode = health.status === 'OK' ? 200 : 503;
            res.status(statusCode).json(health);
        } catch (error) {
            this.handleError(res, error, 'Health check failed', 500);
        }
    };

    private async checkDatabasePing(): Promise<boolean> {
        try {
            if (!mongoose.connection.db) return false;

            const adminDb = mongoose.connection.db.admin();
            await adminDb.ping();
            return true;
        } catch (error) {
            return false;
        }
    }
}