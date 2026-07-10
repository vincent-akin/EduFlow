import { Request, Response } from 'express';
import { SchoolService } from './school.service.js';
import { ResponseHelper } from '../../shared/helpers/response.helper.js';
import { getPaginationOptions } from '../../shared/helpers/pagination.helper.js';

const schoolService = new SchoolService();

type IdParams = {
    id: string;
};

type SlugParams = {
    slug: string;
};

export const createSchool = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const school = await schoolService.createSchool(req.body);

    return ResponseHelper.success(
        res,
        school,
        'School created successfully',
        201
    );
};

export const getSchoolById = async (
    req: Request<IdParams>,
    res: Response
): Promise<Response> => {
    const school = await schoolService.getSchoolById(req.params.id);

    return ResponseHelper.success(
        res,
        school,
        'School retrieved successfully'
    );
};

export const getSchoolBySlug = async (
    req: Request<SlugParams>,
    res: Response
): Promise<Response> => {
    const school = await schoolService.getSchoolBySlug(req.params.slug);

    return ResponseHelper.success(
        res,
        school,
        'School retrieved successfully'
    );
};

export const getSchools = async (
    req: Request,
    res: Response
): Promise<Response> => {
    const { page, limit } = getPaginationOptions(req.query);

    const result = await schoolService.getAllSchools(page, limit);

    return ResponseHelper.paginated(
        res,
        result.data,
        {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit),
        },
        'Schools retrieved successfully'
    );
};

export const updateSchool = async (
    req: Request<IdParams>,
    res: Response
): Promise<Response> => {
    const school = await schoolService.updateSchool(
        req.params.id,
        req.body
    );

    return ResponseHelper.success(
        res,
        school,
        'School updated successfully'
    );
};

export const deleteSchool = async (
    req: Request<IdParams>,
    res: Response
): Promise<Response> => {
    await schoolService.deleteSchool(req.params.id);

    return ResponseHelper.success(
        res,
        null,
        'School deleted successfully'
    );
};

export const permanentlyDeleteSchool = async (
    req: Request<IdParams>,
    res: Response
): Promise<Response> => {
    await schoolService.permanentlyDeleteSchool(req.params.id);

    return ResponseHelper.success(
        res,
        null,
        'School permanently deleted'
    );
};