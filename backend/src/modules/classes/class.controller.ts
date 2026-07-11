import { Request, Response } from 'express';
import { ClassService } from './class.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';
import { Types } from 'mongoose';

const classService = new ClassService();

export const createClass = async (req: Request, res: Response): Promise<Response> => {
    const classItem = await classService.createClass({
        ...req.body,
        schoolId: (req as any).schoolId,
    });
    return ResponseHelper.success(res, classItem, 'Class created successfully', 201);
};

export const getClassById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Class ID is required', 400);
    }
    const classItem = await classService.getClassById(id);
    return ResponseHelper.success(res, classItem, 'Class retrieved successfully');
};

export const getAllClasses = async (req: Request, res: Response): Promise<Response> => {
    const { page, limit } = getPaginationOptions(req.query);
    const schoolId = (req as any).schoolId;
    const filter: any = {};
    
    if (req.query.isActive) {
        filter.isActive = req.query.isActive === 'true';
    }
    
    const result = await classService.getAllClasses(schoolId, page, limit, filter);
    return ResponseHelper.paginated(res, result.data, {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
    }, 'Classes retrieved successfully');
};

export const updateClass = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Class ID is required', 400);
    }
    const classItem = await classService.updateClass(id, req.body);
    return ResponseHelper.success(res, classItem, 'Class updated successfully');
};

export const deleteClass = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    if (!id) {
        return ResponseHelper.error(res, 'Class ID is required', 400);
    }
    await classService.deleteClass(id);
    return ResponseHelper.success(res, null, 'Class deleted successfully');
};

export const getClassesByTeacher = async (req: Request, res: Response): Promise<Response> => {
    const { teacherId } = req.params;
    if (!teacherId) {
        return ResponseHelper.error(res, 'Teacher ID is required', 400);
    }
    const classes = await classService.getClassesByTeacher(new Types.ObjectId(teacherId));
    return ResponseHelper.success(res, classes, 'Classes retrieved successfully');
};