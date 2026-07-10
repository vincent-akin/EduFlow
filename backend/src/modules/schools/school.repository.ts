import { School, ISchool } from './school.model.js';
import { Types } from 'mongoose';

export class SchoolRepository {
    async create(data: Partial<ISchool>): Promise<ISchool> {
        const school = new School(data);
        return school.save();
    }

    async findById(id: string | Types.ObjectId): Promise<ISchool | null> {
        return School.findById(id);
    }

    async findBySlug(slug: string): Promise<ISchool | null> {
        return School.findOne({ slug });
    }

    async findAll(
        filter: any = {},
        page = 1,
        limit = 10
    ): Promise<{ data: ISchool[]; total: number }> {
            const skip = (page - 1) * limit;
            const [data, total] = await Promise.all([
            School.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
            School.countDocuments(filter),
        ]);
        return { data, total };
    }

    async update(id: string | Types.ObjectId, data: Partial<ISchool>): Promise<ISchool | null> {
        return School.findByIdAndUpdate(
        id,
            { ...data, updatedAt: new Date() },
            { new: true, runValidators: true }
        );
    }

    async softDelete(id: string | Types.ObjectId): Promise<ISchool | null> {
        return School.findByIdAndUpdate(
        id,
            { deletedAt: new Date(), isActive: false },
            { new: true }
        );
    }

    async permanentDelete(id: string | Types.ObjectId): Promise<ISchool | null> {
        return School.findByIdAndDelete(id);
    }

    async findByEmail(email: string): Promise<ISchool | null> {
        return School.findOne({ email });
    }
}