import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            res.status(401).json({ error: 'Please authenticate' });
            return;
        }
        
        let decoded: any;
        try {
            // Try to verify with our JWT secret first
            decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        } catch (jwtError) {
            // If that fails, try to verify with NextAuth secret as fallback
            try {
                decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as any;
                // For NextAuth tokens, extract user info differently
                if (decoded.email) {
                    const user = await User.findOne({ email: decoded.email }).select('-password');
                    if (user) {
                        req.user = user;
                        next();
                        return;
                    }
                }
            } catch (nextAuthError) {
                throw jwtError; // Throw original error
            }
        }
        
        // Handle our backend JWT tokens
        if (decoded && decoded.id) {
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                res.status(401).json({ error: 'Please authenticate' });
                return;
            }

            req.user = user;
            next();
        } else {
            res.status(401).json({ error: 'Invalid token format' });
        }
    } catch (error) {
        console.log('Authentication error:', error);
        res.status(401).json({ error: 'Please authenticate' });
    }
};

export const authenticateApiKey = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // const apiKey = req.header('X-API-Key');

        // if (!apiKey) {
        //     return authenticate(req, res, next);
        // }

        // const user = await User.findOne({ apiKey, isActive: true }).select('-password');

        // if (!user) {
        //     res.status(401).json({ error: 'Invalid API key' });
        //     return;
        // }

        // req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentication failed' });
    }
};