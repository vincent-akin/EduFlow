import { Request, Response } from 'express';
import {
    createAssessment,
    getAssessmentById,
    getAllAssessments,
    updateAssessment,
    deleteAssessment,
    publishAssessment,
    closeAssessment,
    getAssessmentsByClass,
    getAssessmentsBySubject,
    getAssessmentsByTeacher,
    getUpcomingAssessments,
    getActiveAssessments,
    duplicateAssessment,
} from './assessment.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

export const createAssessmentController = async (req: Request, res: Response): Promise<Response> => {
    const assessment = await createAssessment({
        ...req.body,
        schoolId: (req as any).schoolId,
        createdBy: (req as any).user.id,
    });
    return ResponseHelper.success(res, assessment, 'Assessment created successfully', 201);
};

export const getAssessmentByIdController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Assessment ID is required', 400);
    }
    const assessment = await getAssessmentById(id);
    return ResponseHelper.success(res, assessment, 'Assessment retrieved successfully');
};

export const getAllAssessmentsController = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit } = getPaginationOptions(req.query);
    const schoolId = (req as any).schoolId;
    const filter: any = {};

    if (req.query.classId) {
        filter.classId = new Types.ObjectId(req.query.classId as string);
    }
    if (req.query.subjectId) {
        filter.subjectId = new Types.ObjectId(req.query.subjectId as string);
    }
    if (req.query.sessionId) {
        filter.sessionId = new Types.ObjectId(req.query.sessionId as string);
    }
    if (req.query.termId) {
        filter.termId = new Types.ObjectId(req.query.termId as string);
    }
    if (req.query.status) {
        filter.status = req.query.status;
    }
    if (req.query.type) {
        filter.type = req.query.type;
    }

    const result = await getAllAssessments(schoolId, page, limit, filter);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Assessments retrieved successfully');
};

export const updateAssessmentController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Assessment ID is required', 400);
    }
    const assessment = await updateAssessment(id, req.body);
    return ResponseHelper.success(res, assessment, 'Assessment updated successfully');
};

export const deleteAssessmentController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Assessment ID is required', 400);
    }
    await deleteAssessment(id);
    return ResponseHelper.success(res, null, 'Assessment deleted successfully');
};

export const publishAssessmentController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Assessment ID is required', 400);
    }
    const assessment = await publishAssessment(id, (req as any).user.id);
    return ResponseHelper.success(res, assessment, 'Assessment published successfully');
};

export const closeAssessmentController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Assessment ID is required', 400);
    }
    const assessment = await closeAssessment(id);
    return ResponseHelper.success(res, assessment, 'Assessment closed successfully');
};

export const getAssessmentsByClassController = async (req: Request, res: Response): Promise<Response> => {
    const { classId } = req.params;
    if (!classId) {
        return ResponseHelper.error(res, 'Class ID is required', 400);
    }
    const { page, limit } = getPaginationOptions(req.query);
    const result = await getAssessmentsByClass(new Types.ObjectId(classId), page, limit);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Assessments retrieved successfully');
};

export const getAssessmentsBySubjectController = async (req: Request, res: Response): Promise<Response> => {
    const { subjectId } = req.params;
    if (!subjectId) {
        return ResponseHelper.error(res, 'Subject ID is required', 400);
    }
    const { page, limit } = getPaginationOptions(req.query);
    const result = await getAssessmentsBySubject(new Types.ObjectId(subjectId), page, limit);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Assessments retrieved successfully');
};

export const getAssessmentsByTeacherController = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit } = getPaginationOptions(req.query);
    const teacherId = (req as any).user.id;
    const result = await getAssessmentsByTeacher(teacherId, page, limit);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Assessments retrieved successfully');
};

export const getUpcomingAssessmentsController = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit } = getPaginationOptions(req.query);
    const schoolId = (req as any).schoolId;
    const result = await getUpcomingAssessments(schoolId, page, limit);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Upcoming assessments retrieved successfully');
};

export const getActiveAssessmentsController = async (req: Request, res: Response): Promise<Response> => {
    const schoolId = (req as any).schoolId;
    const assessments = await getActiveAssessments(schoolId);
    return ResponseHelper.success(res, assessments, 'Active assessments retrieved successfully');
};

export const duplicateAssessmentController = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Assessment ID is required', 400);
    }
    const assessment = await duplicateAssessment(id);
    return ResponseHelper.success(res, assessment, 'Assessment duplicated successfully', 201);
};