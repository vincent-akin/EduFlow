import { Submission, ISubmission } from './submission.model.js';
import { Types } from 'mongoose';

export const createSubmission = async (data: Partial<ISubmission>): Promise<ISubmission> => {
  const submission = new Submission(data);
  return submission.save();
};

export const findSubmissionById = async (id: string | Types.ObjectId): Promise<ISubmission | null> => {
  return Submission.findById(id);
};

export const findSubmissionByAssessmentAndStudent = async (
  assessmentId: Types.ObjectId,
  studentId: Types.ObjectId
): Promise<ISubmission | null> => {
  return Submission.findOne({
    assessmentId,
    studentId,
    status: { $in: ['in_progress', 'submitted'] },
  });
};

export const findAllSubmissions = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: ISubmission[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, ...filter };
  const [data, total] = await Promise.all([
    Submission.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Submission.countDocuments(query),
  ]);
  return { data, total };
};

export const updateSubmission = async (
  id: string | Types.ObjectId,
  data: Partial<ISubmission>
): Promise<ISubmission | null> => {
  return Submission.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

export const submitAssessment = async (
  id: string | Types.ObjectId
): Promise<ISubmission | null> => {
  return Submission.findByIdAndUpdate(
    id,
    {
      status: 'submitted',
      submittedAt: new Date(),
    },
    { new: true }
  );
};

export const gradeSubmission = async (
  id: string | Types.ObjectId,
  gradedBy: Types.ObjectId,
  data: {
    autoScore?: number;
    manualScore?: number;
    finalScore?: number;
    answers?: any[];
  }
): Promise<ISubmission | null> => {
  return Submission.findByIdAndUpdate(
    id,
    {
      ...data,
      status: 'graded',
      gradedBy,
      gradedAt: new Date(),
    },
    { new: true }
  );
};

export const getSubmissionsByAssessment = async (
  assessmentId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: ISubmission[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { assessmentId };
  const [data, total] = await Promise.all([
    Submission.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Submission.countDocuments(query),
  ]);
  return { data, total };
};

export const getSubmissionsByStudent = async (
  studentId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: ISubmission[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { studentId };
  const [data, total] = await Promise.all([
    Submission.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Submission.countDocuments(query),
  ]);
  return { data, total };
};

export const getSubmissionsByStatus = async (
  schoolId: Types.ObjectId,
  status: string,
  page = 1,
  limit = 10
): Promise<{ data: ISubmission[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, status };
  const [data, total] = await Promise.all([
    Submission.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Submission.countDocuments(query),
  ]);
  return { data, total };
};

export const getStudentSubmissionsByAssessment = async (
  studentId: Types.ObjectId,
  assessmentId: Types.ObjectId
): Promise<ISubmission[]> => {
  return Submission.find({
    studentId,
    assessmentId,
  }).sort({ attemptNumber: -1 });
};

export const getPendingGrading = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: ISubmission[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = {
    schoolId,
    status: 'submitted',
  };
  const [data, total] = await Promise.all([
    Submission.find(query).skip(skip).limit(limit).sort({ createdAt: 1 }),
    Submission.countDocuments(query),
  ]);
  return { data, total };
};