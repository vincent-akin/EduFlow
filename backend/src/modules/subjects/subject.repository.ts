import { Subject, ISubject } from './subject.model.js';
import { Types } from 'mongoose';

export const createSubject = async (data: Partial<ISubject>): Promise<ISubject> => {
  const subject = new Subject(data);
  return subject.save();
};

export const findSubjectById = async (id: string | Types.ObjectId): Promise<ISubject | null> => {
  return Subject.findById(id);
};

export const findSubjectByCode = async (schoolId: Types.ObjectId, code: string): Promise<ISubject | null> => {
  return Subject.findOne({ schoolId, code, deletedAt: null });
};

export const findSubjectByName = async (schoolId: Types.ObjectId, name: string): Promise<ISubject | null> => {
  return Subject.findOne({ schoolId, name, deletedAt: null });
};

export const findAllSubjects = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: ISubject[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, deletedAt: null, ...filter };
  const [data, total] = await Promise.all([
    Subject.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Subject.countDocuments(query),
  ]);
  return { data, total };
};

export const updateSubject = async (
  id: string | Types.ObjectId,
  data: Partial<ISubject>
): Promise<ISubject | null> => {
  return Subject.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

export const softDeleteSubject = async (id: string | Types.ObjectId): Promise<ISubject | null> => {
  return Subject.findByIdAndUpdate(
    id,
    { deletedAt: new Date(), isActive: false },
    { new: true }
  );
};

export const getSubjectsByClass = async (classId: Types.ObjectId): Promise<ISubject[]> => {
  return Subject.find({ applicableClasses: classId, deletedAt: null, isActive: true });
};

export const getCoreSubjects = async (schoolId: Types.ObjectId): Promise<ISubject[]> => {
  return Subject.find({ schoolId, isCore: true, deletedAt: null, isActive: true });
};