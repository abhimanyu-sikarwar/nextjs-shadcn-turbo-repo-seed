import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { 
    googleSignInSchema,
    appleSignInSchema,
    refreshTokenSchema,
    userRegistrationSchema,
    exportOptionsSchema,
    importDataSchema
} from '../../schemas';
import { logger } from '../../utils/logger';

// Generic validation middleware creator
export const validateSchema = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            const dataToValidate = source === 'body' ? req.body : 
                                 source === 'query' ? req.query : 
                                 req.params;
            
            // Parse and validate the data
            const validatedData = schema.parse(dataToValidate);
            
            // Replace the original data with validated data
            if (source === 'body') {
                req.body = validatedData;
            } else if (source === 'query') {
                req.query = validatedData as any;
            } else {
                req.params = validatedData as any;
            }
            
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                
                const formattedErrors = error._zod.def.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }));
                logger.warn('Validation error:', { errors: formattedErrors, source });
                
                res.status(400).json({
                    success: false,
                    error: 'Validation failed',
                    details: formattedErrors
                });
            } else {
                logger.error('Unexpected validation error:', error);
                res.status(500).json({
                    success: false,
                    error: 'Internal validation error'
                });
            }
        }
    };
};

// Auth validation middleware
export const validateGoogleSignIn = validateSchema(googleSignInSchema);
export const validateAppleSignIn = validateSchema(appleSignInSchema);
export const validateRefreshToken = validateSchema(refreshTokenSchema);
export const validateUserRegistration = validateSchema(userRegistrationSchema);

// Export/Import validation middleware
export const validateExportOptions = validateSchema(exportOptionsSchema, 'query');
export const validateImportData = validateSchema(importDataSchema);

// MongoDB ObjectId validation
export const validateObjectId = (req: Request, res: Response, next: NextFunction): void => {
    const { id } = req.params;
    
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        res.status(400).json({
            success: false,
            error: 'Invalid ID format'
        });
        return;
    }
    
    next();
};

// Pagination validation for query parameters
export const validatePagination = (req: Request, res: Response, next: NextFunction): void => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    
    if (page < 1) {
        res.status(400).json({
            success: false,
            error: 'Page must be greater than 0'
        });
        return;
    }
    
    if (limit < 1 || limit > 100) {
        res.status(400).json({
            success: false,
            error: 'Limit must be between 1 and 100'
        });
        return;
    }
    
    req.query.page = page.toString();
    req.query.limit = limit.toString();
    
    next();
};
