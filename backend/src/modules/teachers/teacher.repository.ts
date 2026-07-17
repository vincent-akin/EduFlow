import { TeacherProfile } from './teacher.model.js';
import { ITeacherProfile } from '../../shared/interfaces/base.interface.js';
import { Types } from 'mongoose';

export const findTeachers = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: ITeacherProfile[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, deletedAt: null, ...filter };
  const [data, total] = await Promise.all([
    TeacherProfile.find(query)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'firstName lastName email avatar')
      .populate('assignedClasses', 'name')
      .populate('assignedSubjects', 'name')
      .sort({ createdAt: -1 }),
    TeacherProfile.countDocuments(query),
  ]);
  return { data, total };
};

export const findTeacherById = async (id: string | Types.ObjectId): Promise<ITeacherProfile | null> => {
  return TeacherProfile.findById(id)
    .populate('userId', 'firstName lastName email avatar')
    .populate('assignedClasses', 'name')
    .populate('assignedSubjects', 'name');
};

export const findTeacherByUserId = async (userId: Types.ObjectId): Promise<ITeacherProfile | null> => {
  return TeacherProfile.findOne({ userId })
    .populate('userId', 'firstName lastName email avatar')
    .populate('assignedClasses', 'name')
    .populate('assignedSubjects', 'name');
};

export const createTeacher = async (data: Partial<ITeacherProfile>): Promise<ITeacherProfile> => {
  const teacher = new TeacherProfile(data);
  return teacher.save();
};

export const updateTeacher = async (
  id: string | Types.ObjectId,
  data: Partial<ITeacherProfile>
): Promise<ITeacherProfile | null> => {
  return TeacherProfile.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  )
    .populate('userId', 'firstName lastName email avatar')
    .populate('assignedClasses', 'name')
    .populate('assignedSubjects', 'name');
};

export const softDeleteTeacher = async (id: string | Types.ObjectId): Promise<ITeacherProfile | null> => {
  return TeacherProfile.findByIdAndUpdate(
    id,
    { deletedAt: new Date(), isActive: false },
    { new: true }
  );
};