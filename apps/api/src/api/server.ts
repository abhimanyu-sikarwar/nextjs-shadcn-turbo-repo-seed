import 'dotenv/config';
import express, { NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import passport from '../config/passport';
import session from 'express-session';

import path from 'path';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { HealthController } from '../controllers';
import authRoutes from '../routes/authRoutes';
import userRoutes from '../routes/userRoutes';

import { connectDatabase, isDatabaseConnected } from '../config/database';

export class APIServer {
    private app: express.Application;
    private port: number;

    constructor(port: number) {
        this.app = express();
        this.port = port;
        this.setupMiddleware();
        this.setupRoutes();
    }

    private async setupMiddleware(): Promise<void> {

        this.app.use(helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    connectSrc: ["'self'", "https://accounts.google.com"],
                    imgSrc: ["'self'", "data:", "https:"],
                    scriptSrc: ["'self'", "'unsafe-inline'", "https://accounts.google.com"],
                    styleSrc: ["'self'", "'unsafe-inline'"],
                },
            },
        }));
        
        this.app.use(cors({
            origin: process.env.CORS_ORIGIN?.split(',') || '*',
            credentials: true
        }));
        
        // this.app.use(cors());
        this.app.use(express.json({ limit: '10mb' }));
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(compression());
        this.app.use(cookieParser());
        // Session configuration for OAuth
        this.app.use(session({
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            }
        }));

        this.app.use(passport.initialize());
        this.app.use(passport.session());

        // Request logging middleware
        this.app.use((req: Request, res: Response, next: NextFunction) => {
            logger.info(`${req.method} ${req.path}`, {...req.body}, {
                ip: req.ip,
                userAgent: req.get('user-agent')
            });
            next();
        });
        
        // this.app.use((req: Request, res: Response, next) => {
        //     console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        //     next();
        // });
    }
    private async setupRoutes(): Promise<void> {
        await connectDatabase();

        // Verify connection
        if (!isDatabaseConnected()) {
            throw new Error('Database connection verification failed');
        }



        const healthController = new HealthController();
        
        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/users', userRoutes);

        // Health check endpoint
        this.app.get('/health', healthController.checkHealth);

        const uploadsDir = path.resolve(
            process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads')
        );
        this.app.use('/uploads', express.static(uploadsDir));

        // 404 handler
        this.app.use('*', (req: any, res: any) => {
            res.status(404).json({
                success: false,
                error: 'Route not found'
            });
        });
    }
    
    start(): void {
        this.app.listen(this.port, () => {
            logger.info(`Server running on port ${this.port}`);
            logger.info(`📍 Environment: ${process.env.NODE_ENV}`);
            logger.info(`🗄️  Database: Connected to ${process.env.MONGODB_URI?.split(':/')[0]?.toUpperCase()}`);
            logger.info(`🖼️  Storage: ${process.env.AWS_ACCESS_KEY_ID ? 'AWS S3' : 'Local'}`);

            console.log(`\n🚀 Open http://localhost:${this.port}/ in your browser to get started!`);
            console.log(`📡 API Base URL: http://localhost:${this.port}/api`);
        });
    }

}
