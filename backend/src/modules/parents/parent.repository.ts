import { Parent, IParent } from './parent.model.js';
import { Types } from 'mongoose';

export const createParent = async (data: Partial<IParent>): Promise<IParent> => {
  const parent = new Parent(data);
  return parent.save();
};

export const findParentById = async (id: string | Types.ObjectId): Promise<IParent | null> => {
  return Parent.findById(id).populate('children');
};

export const findParentByUserId = async (userId: Types.ObjectId): Promise<IParent | null> => {
  return Parent.findOne({ userId }).populate('children');
};

export const findAllParents = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: IParent[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, deletedAt: null, ...filter };
  const [data, total] = await Promise.all([
    Parent.find(query).skip(skip).limit(limit).populate('children').sort({ createdAt: -1 }),
    Parent.countDocuments(query),
  ]);
  return { data, total };
};

export const updateParent = async (
  id: string | Types.ObjectId,
  data: Partial<IParent>
): Promise<IParent | null> => {
  return Parent.findByIdAndUpdate(
    id,
    { ...data, updatedAt: new Date() },
    { new: true, runValidators: true }
  );
};

export const deleteParent = async (id: string | Types.ObjectId): Promise<IParent | null> => {
  return Parent.findByIdAndUpdate(
    id,
    { deletedAt: new Date(), isActive: false },
    { new: true }
  );
};

export const getParentChildren = async (parentId: Types.ObjectId): Promise<IParent | null> => {
  return Parent.findById(parentId).populate('children');
};

export const linkChildToParent = async (
  parentId: Types.ObjectId,
  studentId: Types.ObjectId
): Promise<IParent | null> => {
  return Parent.findByIdAndUpdate(
    parentId,
    { $addToSet: { children: studentId } },
    { new: true }
  );
};