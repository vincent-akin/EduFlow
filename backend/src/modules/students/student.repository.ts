import { StudentProfile } from './student.model.js';
import { IStudentProfile } from '../../shared/interfaces/base.interface.js';
import { Types } from 'mongoose';

export const findStudents = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: IStudentProfile[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, deletedAt: null, ...filter };
  const [data, total] = await Promise.all([
    StudentProfile.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email avatar')
      .populate('classId', 'name')
      .populate('subjectIds', 'name')
      .sort({ createdAt: -1 }),
    StudentProfile.countDocuments(query),
  ]);
  return { data, total };
};

export const findStudentById = async (id: string | Types.ObjectId): Promise<IStudentProfile | null> => {
  return StudentProfile.findById(id)
    .populate('userId', 'firstName lastName email avatar')
    .populate('classId', 'name')
    .populate('subjectIds', 'name');
};

export const findStudentByUserId = async (userId: Types.ObjectId): Promise<IStudentProfile | null> => {
  return StudentProfile.findOne({ userId })
    .populate('userId', 'firstName lastName email avatar')
    .populate('classId', 'name')
    .populate('subjectIds', 'name');
};

export const findStudentsByClass = async (
  classId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IStudentProfile[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { classId, deletedAt: null, isActive: true };
  const [data, total] = await Promise.all([
    StudentProfile.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email avatar')
      .sort({ createdAt: -1 }),
    StudentProfile.countDocuments(query),
  ]);
  return { data, total };
};

export const createStudent = async (data: Partial<IStudentProfile>): Promise<IStudentProfile> => {
  const student = new StudentProfile(data);
  return student.save();
};

export const updateStudent = async (
  id: string | Types.ObjectId,
  data: Partial<IStudentProfile>
): Promise<IStudentProfile | null> => {
  return StudentProfile.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  )
    .populate('userId', 'firstName lastName email avatar')
    .populate('classId', 'name')
    .populate('subjectIds', 'name');
};

export const softDeleteStudent = async (id: string | Types.ObjectId): Promise<IStudentProfile | null> => {
  return StudentProfile.findByIdAndUpdate(
    id,
    { deletedAt: new Date(), isActive: false },
    { new: true }
  );
};