import { SessionRepository } from './session.repository.js';
import { IAcademicSession, IAcademicTerm } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
//import { ERROR_MESSAGES } from '../../shared/constants/errors.js';
import { Types } from 'mongoose';

const sessionRepository = new SessionRepository();

export class SessionService {
    // ============ Session Services ============
    async createSession(data: Partial<IAcademicSession>): Promise<IAcademicSession> {
        // Check if session with same name exists for this school
        const existing = await sessionRepository.findSessionByName(data.schoolId as Types.ObjectId, data.sessionName!);
        if (existing) {
            throw new AppError('Session with this name already exists', 409);
        }

    // If this is the first session or marked as active, deactivate others
        if (data.isActive) {
            await this.deactivateAllSessions(data.schoolId as Types.ObjectId);
        }

        return sessionRepository.createSession(data);
        }

    async getSessionById(id: string): Promise<IAcademicSession> {
        const session = await sessionRepository.findSessionById(id);
        if (!session) {
            throw new AppError('Session not found', 404);
        }
        return session;
    }

    async getAllSessions(schoolId: Types.ObjectId, page = 1, limit = 10) {
        return sessionRepository.findAllSessions(schoolId, page, limit);
    }

    async updateSession(id: string, data: Partial<IAcademicSession>): Promise<IAcademicSession> {
        const session = await this.getSessionById(id);

        // If setting as active, deactivate others
        if (data.isActive && !session.isActive) {
            await this.deactivateAllSessions(session.schoolId);
        }

        const updated = await sessionRepository.updateSession(id, data);
        if (!updated) {
            throw new AppError('Session not found', 404);
        }
        return updated;
    }

    async deleteSession(id: string): Promise<void> {
        const session = await sessionRepository.deleteSession(id);
        if (!session) {
            throw new AppError('Session not found', 404);
        }
    }

    async deactivateAllSessions(schoolId: Types.ObjectId): Promise<void> {
        // Need to import AcademicSession here to avoid circular dependency
        const { AcademicSession } = await import('./session.model.js');
        await AcademicSession.updateMany(
            { schoolId, isActive: true },
            { isActive: false }
        );
    }

    async getActiveSession(schoolId: Types.ObjectId): Promise<IAcademicSession | null> {
        return sessionRepository.getActiveSession(schoolId);
    }

  // ============ Term Services ============
    async createTerm(data: Partial<IAcademicTerm>): Promise<IAcademicTerm> {
        // Verify session exists
        const session = await sessionRepository.findSessionById(data.sessionId!);
        if (!session) {
            throw new AppError('Session not found', 404);
        }

        // Check if term with same order exists
        const { AcademicTerm } = await import('./term.model.js');
        const existing = await AcademicTerm.findOne({
            sessionId: data.sessionId,
            order: data.order,
            deletedAt: null,
        });
        if (existing) {
            throw new AppError(`Term with order ${data.order} already exists in this session`, 409);
        }

        // If marked as active, deactivate others in this session
        if (data.isActive) {
            await this.deactivateAllTerms(data.sessionId as Types.ObjectId);
        }

        return sessionRepository.createTerm(data);
    }

    async getTermById(id: string): Promise<IAcademicTerm> {
        const term = await sessionRepository.findTermById(id);
        if (!term) {
            throw new AppError('Term not found', 404);
        }
        return term;
    }

    async getAllTerms(sessionId: Types.ObjectId, page = 1, limit = 10) {
        return sessionRepository.findAllTerms(sessionId, page, limit);
    }

    async updateTerm(id: string, data: Partial<IAcademicTerm>): Promise<IAcademicTerm> {
        const term = await this.getTermById(id);

        // If setting as active, deactivate others in same session
        if (data.isActive && !term.isActive) {
            await this.deactivateAllTerms(term.sessionId);
        }

        const updated = await sessionRepository.updateTerm(id, data);
        if (!updated) {
            throw new AppError('Term not found', 404);
        }
        return updated;
    }

    async deleteTerm(id: string): Promise<void> {
        const term = await sessionRepository.deleteTerm(id);
        if (!term) {
            throw new AppError('Term not found', 404);
        }
    }

    async deactivateAllTerms(sessionId: Types.ObjectId): Promise<void> {
        const { AcademicTerm } = await import('./term.model.js');
        await AcademicTerm.updateMany(
            { sessionId, isActive: true },
            { isActive: false }
        );
    }

    async getActiveTerm(sessionId: Types.ObjectId): Promise<IAcademicTerm | null> {
        return sessionRepository.getActiveTerm(sessionId);
    }

    async getTermsBySession(sessionId: Types.ObjectId): Promise<IAcademicTerm[]> {
        return sessionRepository.getTermsBySession(sessionId);
    }
}