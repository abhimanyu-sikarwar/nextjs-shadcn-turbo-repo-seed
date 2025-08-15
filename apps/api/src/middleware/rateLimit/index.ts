import { Request, Response, NextFunction } from 'express';

export interface RateLimitOptions {
    windowMs: number;
    max: number;
    keyGenerator?: (req: Request) => string;
}

const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const createRateLimiter = (options: RateLimitOptions) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        const key = options.keyGenerator
            ? options.keyGenerator(req)
            : req.user?.id || req.ip;

        const now = Date.now();
        const userLimit = requestCounts.get(key);

        if (!userLimit || now > userLimit.resetTime) {
            requestCounts.set(key, {
                count: 1,
                resetTime: now + options.windowMs
            });
            return next();
        }

        if (userLimit.count >= options.max) {
            const retryAfter = Math.ceil((userLimit.resetTime - now) / 1000);

            res.status(429).json({
                error: 'Too many requests',
                retryAfter,
                limit: options.max,
                windowMs: options.windowMs
            });
            return;
        }

        userLimit.count++;
        next();
    };
};


// Different rate limits for different subscription tiers
export const rateLimit = createRateLimiter({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '') || 5 * 60 * 1000, //  5 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '10'), // 10 requests
    keyGenerator: (req: Request & { user?: any }) => {
        if (req.user) {
            // Different limits based on subscription
            const limits: Record<string, number> = {
                free: Number(process.env.FREE_PLAN_LIMIT) || 5,
                basic: Number(process.env.BASIC_PLAN_LIMIT) || 50,
                premium: Number(process.env.PREMIUM_PLAN_LIMIT) || 500,
            };
            const max = limits[req.user.subscription] || 5;

            // Override the max for this user
            return `${req.user.id ?? 'unknown'}_${max}`;
        }
        return req.ip ?? 'unknown';
    }
});