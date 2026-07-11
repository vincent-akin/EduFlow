import { Request, Response } from 'express';
import { SessionService } from './session.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

const sessionService = new SessionService();

export class SessionController {
    // ============ Session Controllers ============
    async createSession(req: Request, res: Response): Promise<Response> {
        const session = await sessionService.createSession({
            ...req.body,
            schoolId: (req as any).schoolId,
            createdBy: (req as any).user.id,
        });
        return ResponseHelper.success(res, session, 'Session created successfully', 201);
    }

    async getSessionById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        if (!id) {
            return ResponseHelper.error(res, 'Session ID is required', 400);
        }
        const session = await sessionService.getSessionById(id);
        return ResponseHelper.success(res, session, 'Session retrieved successfully');
    }

    async getAllSessions(req: Request, res: Response): Promise<Response> {
        const { page, limit } = getPaginationOptions(req.query);
        const schoolId = (req as any).schoolId;
        const result = await sessionService.getAllSessions(schoolId, page, limit);
        return ResponseHelper.paginated(res, result.data, {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit),
        }, 'Sessions retrieved successfully');
    }

    async updateSession(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        if (!id) {
            return ResponseHelper.error(res, 'Session ID is required', 400);
        }
        const session = await sessionService.updateSession(id, req.body);
        return ResponseHelper.success(res, session, 'Session updated successfully');
    }

    async deleteSession(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        if (!id) {
            return ResponseHelper.error(res, 'Session ID is required', 400);
        }
        await sessionService.deleteSession(id);
        return ResponseHelper.success(res, null, 'Session deleted successfully');
    }

    async getActiveSession(req: Request, res: Response): Promise<Response> {
        const schoolId = (req as any).schoolId;
        const session = await sessionService.getActiveSession(schoolId);
        return ResponseHelper.success(res, session, 'Active session retrieved');
    }

  // ============ Term Controllers ============
    async createTerm(req: Request, res: Response): Promise<Response> {
        const term = await sessionService.createTerm({
            ...req.body,
            schoolId: (req as any).schoolId,
        });
        return ResponseHelper.success(res, term, 'Term created successfully', 201);
    }

    async getTermById(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        if (!id) {
            return ResponseHelper.error(res, 'Term ID is required', 400);
        }
        const term = await sessionService.getTermById(id);
        return ResponseHelper.success(res, term, 'Term retrieved successfully');
    }

    async getAllTerms(req: Request, res: Response): Promise<Response> {
        const { page, limit } = getPaginationOptions(req.query);
        const { sessionId } = req.params;
        if (!sessionId) {
            return ResponseHelper.error(res, 'Session ID is required', 400);
        }
        const result = await sessionService.getAllTerms(new Types.ObjectId(sessionId), page, limit);
        return ResponseHelper.paginated(res, result.data, {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit),
        }, 'Terms retrieved successfully');
    }

    async updateTerm(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        if (!id) {
            return ResponseHelper.error(res, 'Term ID is required', 400);
        }
        const term = await sessionService.updateTerm(id, req.body);
        return ResponseHelper.success(res, term, 'Term updated successfully');
    }

    async deleteTerm(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        if (!id) {
            return ResponseHelper.error(res, 'Term ID is required', 400);
        }
        await sessionService.deleteTerm(id);
        return ResponseHelper.success(res, null, 'Term deleted successfully');
    }

    async getActiveTerm(req: Request, res: Response): Promise<Response> {
        const { sessionId } = req.params;
        if (!sessionId) {
            return ResponseHelper.error(res, 'Session ID is required', 400);
        }
        const term = await sessionService.getActiveTerm(new Types.ObjectId(sessionId));
        return ResponseHelper.success(res, term, 'Active term retrieved');
    }

    async getTermsBySession(req: Request, res: Response): Promise<Response> {
        const { sessionId } = req.params;
        if (!sessionId) {
            return ResponseHelper.error(res, 'Session ID is required', 400);
        }
        const terms = await sessionService.getTermsBySession(new Types.ObjectId(sessionId));
        return ResponseHelper.success(res, terms, 'Terms retrieved successfully');
    }
}