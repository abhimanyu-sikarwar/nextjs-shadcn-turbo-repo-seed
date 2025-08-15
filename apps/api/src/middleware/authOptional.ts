import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthRequest extends Request {
    user?: any;
}

// Optional authentication - for testing purposes
export const authenticateOptional = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            // If no token, create a test user for now
            const testUser = await User.findOne({ email: 'test@example.com' });
            if (testUser) {
                req.user = testUser;
            }
            next();
            return;
        }
        
        let decoded: any;
        try {
            // Try to verify with our JWT secret first
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            
            const user = await User.findById(decoded.id).select('-password');
            if (user) {
                req.user = user;
                next();
                return;
            }
        } catch (jwtError) {
            // If JWT verification fails, proceed without authentication
            console.log('JWT verification failed, proceeding without auth:', jwtError);
        }
        
        next();
    } catch (error) {
        console.log('Authentication error:', error);
        next(); // Proceed without authentication for testing
    }
};