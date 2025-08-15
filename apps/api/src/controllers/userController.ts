import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { UserUpdateRequest } from '../types';
import { logger } from '../utils/logger';
import { BaseController } from './baseController';

export class UserController extends BaseController {
    private userService: UserService;

    constructor() {
        super();
        this.userService = new UserService();
    }

    getProfile = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const user = await this.userService.getUserById(req.user.id);

            if (!user) {
                this.sendError(res, 'User not found', 404);
                return;
            }

            this.sendSuccess(res, {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    profilePicture: user.profilePicture,
                    subscription: user.subscription,
                    authProvider: user.authProvider,
                    emailVerified: user.emailVerified,
                    createdAt: user.createdAt
                }
            });
        } catch (error) {
            logger.error('Get profile error:', error);
            next(error);
        }
    };

    updateProfile = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const updates: UserUpdateRequest = req.body;
            const user = await this.userService.updateUser(req.user.id, updates);

            this.sendSuccess(res, {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    profilePicture: user.profilePicture
                }
            });
        } catch (error: any) {
            logger.error('Update profile error:', error);
            this.sendError(res, error.message || 'Failed to update profile', 400);
        }
    };

    deleteAccount = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await this.userService.deleteUser(req.user.id);

            this.sendSuccess(res, {}, 'Account deleted successfully');
        } catch (error) {
            logger.error('Delete account error:', error);
            next(error);
        }
    };

    getUserStats = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const stats = await this.userService.getUserStats(req.user.id);

            this.sendSuccess(res, { stats });
        } catch (error) {
            logger.error('Get user stats error:', error);
            next(error);
        }
    };

    updateUserPreferences = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const preferences = req.body;
            const user = await this.userService.updateUserSystemPreferences(req.user.id, preferences);

            this.sendSuccess(res, {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    profilePicture: user.profilePicture,
                    preferences: user.preferences
                }
            }, 'User preferences updated successfully');
        } catch (error: any) {
            logger.error('Update user preferences error:', error);
            this.sendError(res, error.message || 'Failed to update preferences', 400);
        }
    };

    exportData = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { format = 'json' } = req.query;
            const exportData = await this.userService.exportUserData(req.user.id, format as string);

            if (format === 'csv') {
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename="user-preferences.csv"');
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', 'attachment; filename="user-preferences.json"');
            }

            res.send(exportData);
        } catch (error: any) {
            logger.error('Export data error:', error);
            this.sendError(res, error.message || 'Failed to export user data', 500);
        }
    };
}