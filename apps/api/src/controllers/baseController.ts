import { Request, Response } from 'express';

export abstract class BaseController {
    protected handleError(res: Response, error: any, message: string = 'Internal server error', statusCode: number = 500) {
        console.error(`${message}:`, error);
        if (!res.headersSent) {
            res.status(statusCode).json({
                success: false,
                error: message
            });
        }
    }

    protected sendSuccess(res: Response, data: any, message?: string) {
        const response: any = { success: true, ...data };
        if (message) {
            response.message = message;
        }
        res.json(response);
    }

    protected sendError(res: Response, error: string, statusCode: number = 400) {
        res.status(statusCode).json({
            success: false,
            error
        });
    }
}
