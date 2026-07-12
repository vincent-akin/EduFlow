import { Result, IResult } from './result.model.js';
import { ReportCard, IReportCard } from '../report-cards/report-card.model.js';
import { Types } from 'mongoose';

// ============ Result Repository ============
export const createResult = async (data: Partial<IResult>): Promise<IResult> => {
  const result = new Result(data);
  return result.save();
};

export const findResultById = async (id: string | Types.ObjectId): Promise<IResult | null> => {
  return Result.findById(id);
};

export const findResultBySubmission = async (submissionId: Types.ObjectId): Promise<IResult | null> => {
  return Result.findOne({ submissionId });
};

export const findAllResults = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: IResult[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, ...filter };
  const [data, total] = await Promise.all([
    Result.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Result.countDocuments(query),
  ]);
  return { data, total };
};

export const updateResult = async (
  id: string | Types.ObjectId,
  data: Partial<IResult>
): Promise<IResult | null> => {
  return Result.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

export const publishResult = async (
  id: string | Types.ObjectId,
  publishedBy: Types.ObjectId
): Promise<IResult | null> => {
  return Result.findByIdAndUpdate(
    id,
    {
      status: 'published',
      publishedBy,
      publishedAt: new Date(),
    },
    { new: true }
  );
};

export const getResultsByStudent = async (
  studentId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IResult[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { studentId, status: 'published' };
  const [data, total] = await Promise.all([
    Result.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Result.countDocuments(query),
  ]);
  return { data, total };
};

export const getResultsByAssessment = async (
  assessmentId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IResult[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { assessmentId };
  const [data, total] = await Promise.all([
    Result.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Result.countDocuments(query),
  ]);
  return { data, total };
};

export const getResultsByClass = async (
  classId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IResult[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { classId, status: 'published' };
  const [data, total] = await Promise.all([
    Result.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Result.countDocuments(query),
  ]);
  return { data, total };
};

// ============ Report Card Repository ============
export const createReportCard = async (data: Partial<IReportCard>): Promise<IReportCard> => {
  const reportCard = new ReportCard(data);
  return reportCard.save();
};

export const findReportCardById = async (id: string | Types.ObjectId): Promise<IReportCard | null> => {
  return ReportCard.findById(id);
};

export const findReportCardByStudentAndTerm = async (
  studentId: Types.ObjectId,
  termId: Types.ObjectId
): Promise<IReportCard | null> => {
  return ReportCard.findOne({ studentId, termId, deletedAt: null });
};

export const findAllReportCards = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: IReportCard[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, deletedAt: null, ...filter };
  const [data, total] = await Promise.all([
    ReportCard.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    ReportCard.countDocuments(query),
  ]);
  return { data, total };
};

export const updateReportCard = async (
  id: string | Types.ObjectId,
  data: Partial<IReportCard>
): Promise<IReportCard | null> => {
  return ReportCard.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

export const deleteReportCard = async (id: string | Types.ObjectId): Promise<IReportCard | null> => {
  return ReportCard.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true }
  );
};

export const getReportCardsByStudent = async (
  studentId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IReportCard[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { studentId, deletedAt: null };
  const [data, total] = await Promise.all([
    ReportCard.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    ReportCard.countDocuments(query),
  ]);
  return { data, total };
};

export const getReportCardsByClass = async (
  classId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IReportCard[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { classId, deletedAt: null };
  const [data, total] = await Promise.all([
    ReportCard.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    ReportCard.countDocuments(query),
  ]);
  return { data, total };
};