import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { logger } from '../../utils/logger';

// User profile update schema
const userProfileUpdateSchema = z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    profilePicture: z.string().url().optional(),
}).strict();

// Password change schema
const passwordChangeSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
}).strict();

// System preferences update schema
const systemPreferencesSchema = z.object({
    language: z.enum(['en', 'es', 'fr', 'de']).optional(),
    timezone: z.string().optional(),
    theme: z.enum(['light', 'dark', 'auto']).optional(),
    notifications: z.object({
        email: z.boolean().optional(),
        push: z.boolean().optional(),
        sms: z.boolean().optional(),
    }).optional(),
    privacy: z.object({
        profileVisibility: z.enum(['public', 'private']).optional(),
        dataSharing: z.boolean().optional(),
        analytics: z.boolean().optional(),
    }).optional(),
}).strict();

// User login schema
const userLoginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
}).strict();

// Validation middleware creators
export const validateUserProfileUpdate = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const validatedData = userProfileUpdateSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        if (error instanceof ZodError) {

            const formattedErrors = error._zod.def.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
            }));
            
            logger.warn('User profile validation error:', { errors: formattedErrors });
            
            res.status(400).json({
                success: false,
                error: 'Profile validation failed',
                details: formattedErrors
            });
        } else {
            logger.error('Unexpected user profile validation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal validation error'
            });
        }
    }
};

export const validatePasswordChange = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const validatedData = passwordChangeSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        if (error instanceof ZodError) {

            const formattedErrors = error._zod.def.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
            }));
            
            logger.warn('Password change validation error:', { errors: formattedErrors });
            
            res.status(400).json({
                success: false,
                error: 'Password validation failed',
                details: formattedErrors
            });
        } else {
            logger.error('Unexpected password validation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal validation error'
            });
        }
    }
};


export const validateSystemPreferences = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const validatedData = systemPreferencesSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        if (error instanceof ZodError) {

            const formattedErrors = error._zod.def.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
            }));
            
            logger.warn('System preferences validation error:', { errors: formattedErrors });
            
            res.status(400).json({
                success: false,
                error: 'System preferences validation failed',
                details: formattedErrors
            });
        } else {
            logger.error('Unexpected system preferences validation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal validation error'
            });
        }
    }
};

export const validateUserLogin = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const validatedData = userLoginSchema.parse(req.body);
        req.body = validatedData;
        next();
    } catch (error) {
        if (error instanceof ZodError) {

            const formattedErrors = error._zod.def.map((err: any) => ({
                field: err.path.join('.'),
                message: err.message,
                code: err.code
            }));
            
            logger.warn('User login validation error:', { errors: formattedErrors });
            
            res.status(400).json({
                success: false,
                error: 'Login validation failed',
                details: formattedErrors
            });
        } else {
            logger.error('Unexpected login validation error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal validation error'
            });
        }
    }
};

// Export schemas for reuse
export {
    userProfileUpdateSchema,
    passwordChangeSchema,
    systemPreferencesSchema,
    userLoginSchema
};
