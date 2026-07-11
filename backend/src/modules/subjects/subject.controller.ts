import { Request, Response } from 'express';
import { SubjectService } from './subject.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

const subjectService = new SubjectService();

export const createSubject = async (req: Request, res: Response): Promise<Response> => {
    const subject = await subjectService.createSubject({
        ...req.body,
        schoolId: (req as any).schoolId,
    });
    return ResponseHelper.success(res, subject, 'Subject created successfully', 201);
};

export const getSubjectById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Subject ID is required', 400);
    }
    const subject = await subjectService.getSubjectById(id);
    return ResponseHelper.success(res, subject, 'Subject retrieved successfully');
};

export const getAllSubjects = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit } = getPaginationOptions(req.query);
    const schoolId = (req as any).schoolId;
    const filter: any = {};
    
    if (req.query.isCore) {
        filter.isCore = req.query.isCore === 'true';
    }
    if (req.query.isActive) {
        filter.isActive = req.query.isActive === 'true';
    }
    
    const result = await subjectService.getAllSubjects(schoolId, page, limit, filter);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Subjects retrieved successfully');
};

export const updateSubject = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Subject ID is required', 400);
    }
    const subject = await subjectService.updateSubject(id, req.body);
    return ResponseHelper.success(res, subject, 'Subject updated successfully');
};

export const deleteSubject = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Subject ID is required', 400);
    }
    await subjectService.deleteSubject(id);
    return ResponseHelper.success(res, null, 'Subject deleted successfully');
};

export const getSubjectsByClass = async (req: Request, res: Response): Promise<Response> => {
    const { classId } = req.params;
    if (!classId) {
        return ResponseHelper.error(res, 'Class ID is required', 400);
    }
    const subjects = await subjectService.getSubjectsByClass(new Types.ObjectId(classId));
    return ResponseHelper.success(res, subjects, 'Subjects retrieved successfully');
};

export const getCoreSubjects = async (req: Request, res: Response): Promise<Response> => {
    const schoolId = (req as any).schoolId;
    const subjects = await subjectService.getCoreSubjects(schoolId);
    return ResponseHelper.success(res, subjects, 'Core subjects retrieved successfully');
};