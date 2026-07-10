import { Response } from 'express';
//import { ApiResponse } from '../../types';

export class ResponseHelper {
    static success<T>(
        res: Response,
        data: T,
        message = 'Success',
        statusCode = 200
    ): Response {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    }

    static paginated<T>(
        res: Response,
        data: T[],
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        },
        message = 'Success'
    ): Response {
        return res.status(200).json({
            success: true,
            message,
            data,
            meta,
        });
    }

    static error(
        res: Response,
        message: string,
        statusCode = 400,
        errors?: any[]
    ): Response {
        return res.status(statusCode).json({
            success: false,
            message,
            ...(errors && { errors }),
        });
    }
}