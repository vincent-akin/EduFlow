import {
    createAssessment as createAssessmentRepo,
    findAssessmentById,
    findAllAssessments,
    updateAssessment as updateAssessmentRepo,
    softDeleteAssessment,
    publishAssessment as publishAssessmentRepo,
    closeAssessment as closeAssessmentRepo,
    getAssessmentsByClass as getAssessmentsByClassRepo,
    getAssessmentsBySubject as getAssessmentsBySubjectRepo,
    getAssessmentsByTeacher as getAssessmentsByTeacherRepo,
    getUpcomingAssessments as getUpcomingAssessmentsRepo,
    getActiveAssessments as getActiveAssessmentsRepo,
} from './assessment.repository.js';
import { IAssessment } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';
import { Question } from '../questions/question.model.js';

export const createAssessment = async (data: Partial<IAssessment>): Promise<IAssessment> => {
  // Validate that end time is after start time
    if (data.startTime && data.endTime) {
        if (new Date(data.endTime) <= new Date(data.startTime)) {
            throw new AppError('End time must be after start time', 400);
        }
    }

  // Calculate total marks from questions
    if (data.questions && data.questions.length > 0) {
        const totalMarks = data.questions.reduce((sum, q) => sum + q.marks, 0);
        data.totalMarks = totalMarks;
        data.questionCount = data.questions.length;
    }

    return createAssessmentRepo(data);
};

export const getAssessmentById = async (id: string): Promise<IAssessment> => {
    const assessment = await findAssessmentById(id);
    if (!assessment) {
        throw new AppError('Assessment not found', 404);
    }
    return assessment;
};

export const getAllAssessments = async (
    schoolId: Types.ObjectId,
    page = 1,
    limit = 10,
    filter: any = {}
) => {
    return findAllAssessments(schoolId, page, limit, filter);
};

export const updateAssessment = async (id: string, data: Partial<IAssessment>): Promise<IAssessment> => {
    const assessment = await getAssessmentById(id);

    // Don't allow updates to published assessments
    if (assessment.status === 'published') {
        throw new AppError('Cannot update a published assessment', 400);
    }

  // Validate end time after start time
    if (data.startTime && data.endTime) {
        if (new Date(data.endTime) <= new Date(data.startTime)) {
            throw new AppError('End time must be after start time', 400);
        }
    }

    // Recalculate total marks if questions changed
    if (data.questions) {
        const totalMarks = data.questions.reduce((sum, q) => sum + q.marks, 0);
        data.totalMarks = totalMarks;
        data.questionCount = data.questions.length;
    }

    const updated = await updateAssessmentRepo(id, data);
    if (!updated) {
        throw new AppError('Assessment not found', 404);
    }
    return updated;
};

export const deleteAssessment = async (id: string): Promise<void> => {
    const assessment = await softDeleteAssessment(id);
    if (!assessment) {
        throw new AppError('Assessment not found', 404);
    }
};

export const publishAssessment = async (
    id: string,
    publishedBy: Types.ObjectId
): Promise<IAssessment> => {
    const assessment = await getAssessmentById(id);

    // Can only publish draft assessments
    if (assessment.status !== 'draft') {
        throw new AppError('Only draft assessments can be published', 400);
    }

    // Ensure assessment has questions
    if (!assessment.questions || assessment.questions.length === 0) {
        throw new AppError('Assessment must have at least one question', 400);
    }

    // Ensure start time is in the future or now
    if (new Date(assessment.startTime) < new Date()) {
        throw new AppError('Start time must be in the future', 400);
    }

  // Publish the assessment (repository handles snapshots)
    const published = await publishAssessmentRepo(id, publishedBy);
    if (!published) {
        throw new AppError('Assessment not found', 404);
    }

  // Increment usage count for all questions
    await Promise.all(
        assessment.questions.map((q) =>
        Question.findByIdAndUpdate(q.questionId, { $inc: { usageCount: 1 } })
        )
    );

    return published;
};

export const closeAssessment = async (id: string): Promise<IAssessment> => {
    const assessment = await getAssessmentById(id);

    if (assessment.status !== 'published') {
        throw new AppError('Only published assessments can be closed', 400);
    }

    const closed = await closeAssessmentRepo(id);
    if (!closed) {
        throw new AppError('Assessment not found', 404);
    }
    return closed;
};

export const getAssessmentsByClass = async (
    classId: Types.ObjectId,
    page = 1,
    limit = 10
) => {
    return getAssessmentsByClassRepo(classId, page, limit);
};

export const getAssessmentsBySubject = async (
    subjectId: Types.ObjectId,
    page = 1,
    limit = 10
) => {
    return getAssessmentsBySubjectRepo(subjectId, page, limit);
};

export const getAssessmentsByTeacher = async (
    createdBy: Types.ObjectId,
    page = 1,
    limit = 10
) => {
    return getAssessmentsByTeacherRepo(createdBy, page, limit);
};

export const getUpcomingAssessments = async (
    schoolId: Types.ObjectId,
    page = 1,
    limit = 10
) => {
    return getUpcomingAssessmentsRepo(schoolId, page, limit);
};

export const getActiveAssessments = async (schoolId: Types.ObjectId) => {
    return getActiveAssessmentsRepo(schoolId);
};

export const duplicateAssessment = async (id: string): Promise<IAssessment> => {
    const assessment = await getAssessmentById(id);

    // Create a plain object copy
    const assessmentData: Partial<IAssessment> = {
        schoolId: assessment.schoolId,
        sessionId: assessment.sessionId,
        termId: assessment.termId,
        classId: assessment.classId,
        subjectId: assessment.subjectId,
        createdBy: assessment.createdBy,
        title: `${assessment.title} (Copy)`,
        description: assessment.description || null,
        type: assessment.type,
        deliveryMode: assessment.deliveryMode,
        instructions: assessment.instructions || '',
        durationMinutes: assessment.durationMinutes,
        totalMarks: assessment.totalMarks || 0,
        passMark: assessment.passMark || 0,
        shuffleQuestions: assessment.shuffleQuestions || false,
        shuffleOptions: assessment.shuffleOptions || false,
        allowReview: assessment.allowReview !== undefined ? assessment.allowReview : true,
        startTime: assessment.startTime,
        endTime: assessment.endTime,
        status: 'draft',
        questionCount: assessment.questions?.length || 0,
        questions: assessment.questions?.map(q => ({
            questionId: q.questionId,
            order: q.order,
            marks: q.marks,
            snapshot: q.snapshot, // Keep the snapshot if it exists (for published assessments)
        })) || [],
    };

  const duplicate = await createAssessment(assessmentData);
  return duplicate;
};