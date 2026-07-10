import { SchoolRepository } from './school.repository.js';
import { ISchool } from './school.model.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { ERROR_MESSAGES } from '../../shared/constants/errors.js';
import slugify from 'slugify';

const schoolRepository = new SchoolRepository();

export class SchoolService {
    async createSchool(data: Partial<ISchool>): Promise<ISchool> {
        if (data.email) {
            const existingSchool = await schoolRepository.findByEmail(data.email);
            if (existingSchool) {
                throw new AppError(ERROR_MESSAGES.SCHOOL_ALREADY_EXISTS, 409);
            }
        }

        if (data.name) {
            data.slug = slugify(data.name, { lower: true, strict: true });
        }

        return schoolRepository.create(data);
    }

    async getSchoolById(id: string): Promise<ISchool> {
        const school = await schoolRepository.findById(id);
        if (!school) {
            throw new AppError(ERROR_MESSAGES.SCHOOL_NOT_FOUND, 404);
        }
        return school;
    }

    async getSchoolBySlug(slug: string): Promise<ISchool> {
        const school = await schoolRepository.findBySlug(slug);
        if (!school) {
            throw new AppError(ERROR_MESSAGES.SCHOOL_NOT_FOUND, 404);
        }
        return school;
    }

    async getAllSchools(page = 1, limit = 10): Promise<{ data: ISchool[]; total: number }> {
        const filter = { deletedAt: null };
        return schoolRepository.findAll(filter, page, limit);
    }

    async updateSchool(id: string, data: Partial<ISchool>): Promise<ISchool> {
        const school = await schoolRepository.findById(id);
        if (!school) {
            throw new AppError(ERROR_MESSAGES.SCHOOL_NOT_FOUND, 404);
        }

        if (data.name && data.name !== school.name) {
            data.slug = slugify(data.name, { lower: true, strict: true });
        }

        const updatedSchool = await schoolRepository.update(id, data);
        if (!updatedSchool) {
            throw new AppError(ERROR_MESSAGES.SCHOOL_NOT_FOUND, 404);
        }
        return updatedSchool;
    }

    async deleteSchool(id: string): Promise<void> {
        const school = await schoolRepository.softDelete(id);
        if (!school) {
            throw new AppError(ERROR_MESSAGES.SCHOOL_NOT_FOUND, 404);
        }
    }

    async permanentlyDeleteSchool(id: string): Promise<void> {
        const school = await schoolRepository.permanentDelete(id);
        if (!school) {
            throw new AppError(ERROR_MESSAGES.SCHOOL_NOT_FOUND, 404);
        }
    }
}