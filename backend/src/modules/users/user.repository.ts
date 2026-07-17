import { User, IUser } from './user.model.js';
import { Types } from 'mongoose';

export const findUsers = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: IUser[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, deletedAt: null, ...filter };
  const [data, total] = await Promise.all([
    User.find(query)
      .skip(skip)
      .limit(limit)
      .select('-passwordHash')
      .sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);
  return { data, total };
};

export const findUserById = async (id: string | Types.ObjectId): Promise<IUser | null> => {
  return User.findById(id).select('-passwordHash');
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email }).select('-passwordHash');
};

export const updateUser = async (
  id: string | Types.ObjectId,
  data: Partial<IUser>
): Promise<IUser | null> => {
  // Remove passwordHash from update data if present
  const { passwordHash, ...updateData } = data;
  return User.findByIdAndUpdate(
    id,
    { ...updateData, updatedAt: new Date() },
    { new: true, runValidators: true }
  ).select('-passwordHash');
};

export const softDeleteUser = async (id: string | Types.ObjectId): Promise<IUser | null> => {
  return User.findByIdAndUpdate(
    id,
    { deletedAt: new Date(), isActive: false },
    { new: true }
  ).select('-passwordHash');
};

export const findTeachers = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IUser[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, role: 'teacher', deletedAt: null, isActive: true };
  const [data, total] = await Promise.all([
    User.find(query)
      .skip(skip)
      .limit(limit)
      .select('-passwordHash')
      .sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);
  return { data, total };
};

export const findStudents = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IUser[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, role: 'student', deletedAt: null, isActive: true };
  const [data, total] = await Promise.all([
    User.find(query)
      .skip(skip)
      .limit(limit)
      .select('-passwordHash')
      .sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);
  return { data, total };
};

export const findParents = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IUser[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, role: 'parent', deletedAt: null, isActive: true };
  const [data, total] = await Promise.all([
    User.find(query)
      .skip(skip)
      .limit(limit)
      .select('-passwordHash')
      .sort({ createdAt: -1 }),
    User.countDocuments(query),
  ]);
  return { data, total };
};