import { AcademicSession } from './session.model.js';
import { AcademicTerm } from './term.model.js';
import { IAcademicSession, IAcademicTerm } from '../../shared/interfaces/base.interface.js';
import { Types } from 'mongoose';

export class SessionRepository {
  // ============ Session Methods ============
    async createSession(data: Partial<IAcademicSession>): Promise<IAcademicSession> {
        const session = new AcademicSession(data);
        return session.save();
    }

    async findSessionById(id: string | Types.ObjectId): Promise<IAcademicSession | null> {
        return AcademicSession.findById(id);
    }

    async findSessionByName(schoolId: Types.ObjectId, sessionName: string): Promise<IAcademicSession | null> {
        return AcademicSession.findOne({ schoolId, sessionName });
    }

    async findAllSessions(
        schoolId: Types.ObjectId,
        page = 1,
        limit = 10
    ): Promise<{ data: IAcademicSession[]; total: number }> {
        const skip = (page - 1) * limit;
        const filter = { schoolId, deletedAt: null };
        const [data, total] = await Promise.all([
            AcademicSession.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            AcademicSession.countDocuments(filter),
        ]);
        return { data, total };
    }

    async updateSession(id: string | Types.ObjectId, data: Partial<IAcademicSession>): Promise<IAcademicSession | null> {
        return AcademicSession.findByIdAndUpdate(
        id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async deleteSession(id: string | Types.ObjectId): Promise<IAcademicSession | null> {
        return AcademicSession.findByIdAndUpdate(
            id,
            { deletedAt: new Date(), isActive: false },
            { new: true }
        );
    }

    async getActiveSession(schoolId: Types.ObjectId): Promise<IAcademicSession | null> {
        return AcademicSession.findOne({ schoolId, isActive: true, deletedAt: null });
    }

  // ============ Term Methods ============
    async createTerm(data: Partial<IAcademicTerm>): Promise<IAcademicTerm> {
        const term = new AcademicTerm(data);
        return term.save();
    }

    async findTermById(id: string | Types.ObjectId): Promise<IAcademicTerm | null> {
        return AcademicTerm.findById(id);
    }

    async findAllTerms(
        sessionId: Types.ObjectId,
        page = 1,
        limit = 10
    ): Promise<{ data: IAcademicTerm[]; total: number }> {
        const skip = (page - 1) * limit;
        const filter = { sessionId, deletedAt: null };
        const [data, total] = await Promise.all([
            AcademicTerm.find(filter).skip(skip).limit(limit).sort({ order: 1 }),
            AcademicTerm.countDocuments(filter),
        ]);
        return { data, total };
    }

    async updateTerm(id: string | Types.ObjectId, data: Partial<IAcademicTerm>): Promise<IAcademicTerm | null> {
        return AcademicTerm.findByIdAndUpdate(
            id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async deleteTerm(id: string | Types.ObjectId): Promise<IAcademicTerm | null> {
        return AcademicTerm.findByIdAndUpdate(
            id,
            { deletedAt: new Date(), isActive: false },
            { new: true }
        );
    }

    async getActiveTerm(sessionId: Types.ObjectId): Promise<IAcademicTerm | null> {
        return AcademicTerm.findOne({ sessionId, isActive: true, deletedAt: null });
    }

    async getTermsBySession(sessionId: Types.ObjectId): Promise<IAcademicTerm[]> {
        return AcademicTerm.find({ sessionId, deletedAt: null }).sort({ order: 1 });
    }
}