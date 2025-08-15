import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { UserRegistrationRequest } from '../types';
import { logger } from '../utils/logger';
import { BaseController } from './baseController';

export class AuthController extends BaseController {
    private authService = new AuthService();

    // constructor() {
    //     this.authService = new AuthService();
    // }

    register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const registrationData: UserRegistrationRequest = req.body;

            const { user, tokens } = await this.authService.registerUser(registrationData);

            this.sendSuccess(res, {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    subscription: user.subscription
                },
                tokens
            });
        } catch (error: any) {
            logger.error('Registration error:', error);
            this.sendError(res, error.message || 'Registration failed');
        }
    };

    login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { email, password } = req.body;
            const { user, tokens } = await this.authService.loginUser(email, password);

            this.sendSuccess(res, {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    subscription: user.subscription,
                    profilePicture: user.profilePicture
                },
                tokens
            });
        } catch (error: any) {
            logger.error('Login error:', error);
            this.sendError(res, error.message || 'Login failed');
        }
    };

    googleSignIn = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { idToken } = req.body;

            if (!idToken) {
                this.sendError(res, 'Google ID token is required');
                return;
            }

            const { user, tokens, isNewUser } = await this.authService.googleSignIn(idToken);

            // Set secure cookies
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
            };

            res.cookie('accessToken', tokens.accessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            res.cookie('refreshToken', tokens.refreshToken, {
                ...cookieOptions,
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            this.sendSuccess(res, {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    subscription: user.subscription,
                    profilePicture: user.profilePicture
                },
                tokens,
                isNewUser
            });
        } catch (error: any) {
            logger.error('Google sign-in error:', error);
            this.sendError(res, 'Google sign-in failed');
        }
    };

    appleSignIn = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { idToken } = req.body;

            if (!idToken) {
                this.sendError(res, 'Apple ID token is required', 400);
                return;
            }

            const { user, tokens, isNewUser } = await this.authService.appleSignIn(idToken);

            this.sendSuccess(res, {
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    subscription: user.subscription,
                    profilePicture: user.profilePicture,
                },
                tokens,
                isNewUser,
            });
        } catch (error: any) {
            logger.error('Apple sign-in error:', error);
            this.sendError(res, error.message || 'Apple sign-in failed', 401);
        }
    };

    googleCallback = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
                return;
            }

            const user = req.user;
            const tokens = await this.authService.generateTokensForUser(user._id);

            // Set secure cookies
            const cookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
            };

            res.cookie('accessToken', tokens.accessToken, {
                ...cookieOptions,
                maxAge: 15 * 60 * 1000, // 15 minutes
            });

            res.cookie('refreshToken', tokens.refreshToken, {
                ...cookieOptions,
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            });

            // Redirect to frontend with success
            res.redirect(`${process.env.FRONTEND_URL}/auth/callback?success=true`);
        } catch (error) {
            logger.error('Google callback error:', error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=callback_failed`);
        }
    };

    refreshToken = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                this.sendError(res, 'Refresh token is required', 400);
                return;
            }

            const tokens = await this.authService.refreshTokens(refreshToken);

            this.sendSuccess(res, { tokens });
        } catch (error: any) {
            logger.error('Token refresh error:', error);
            this.sendError(res, error.message || 'Token refresh failed', 401);
        }
    };

    logout = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await this.authService.logout(req.user.id);

            this.sendSuccess(res, {}, 'Logged out successfully');
        } catch (error) {
            logger.error('Logout error:', error);
            next(error);
        }
    };

    generateApiKey = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const apiKey = await this.authService.generateApiKey(req.user.id);

            this.sendSuccess(res, { apiKey });
        } catch (error) {
            logger.error('API key generation error:', error);
            next(error);
        }
    };

    revokeApiKey = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            await this.authService.revokeApiKey(req.user.id);

            this.sendSuccess(res, {}, 'API key revoked successfully');
        } catch (error) {
            logger.error('API key revocation error:', error);
            next(error);
        }
    };

    getMe = async (
        req: Request & { user?: any },
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            if (!req.user) {
                this.sendError(res, 'User not authenticated', 401);
                return;
            }

            this.sendSuccess(res, {
                user: {
                    id: req.user._id,
                    email: req.user.email,
                    name: req.user.name,
                    profilePicture: req.user.profilePicture
                }
            });
        } catch (error) {
            logger.error('Get me error:', error);
            next(error);
        }
    };
}