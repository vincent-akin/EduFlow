import { AIGeneration, IAIGeneration } from './ai.model.js';
import { Types } from 'mongoose';

type AIGenerationInput = Pick<IAIGeneration, 'schoolId' | 'userId' | 'provider' | 'model' | 'feature' | 'prompt' | 'response'> &
  Partial<Omit<IAIGeneration, 'schoolId' | 'userId' | 'provider' | 'model' | 'feature' | 'prompt' | 'response'>>;

export const createAIGeneration = async (data: AIGenerationInput): Promise<IAIGeneration> => {
  const generation = new AIGeneration(data);
  return generation.save();
};

export const findAIGenerationById = async (id: string | Types.ObjectId): Promise<IAIGeneration | null> => {
  return AIGeneration.findById(id);
};

export const findAllAIGenerations = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
): Promise<{ data: IAIGeneration[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, ...filter };
  const [data, total] = await Promise.all([
    AIGeneration.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    AIGeneration.countDocuments(query),
  ]);
  return { data, total };
};

export const findAIGenerationsByUser = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10
): Promise<{ data: IAIGeneration[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { userId };
  const [data, total] = await Promise.all([
    AIGeneration.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    AIGeneration.countDocuments(query),
  ]);
  return { data, total };
};

export const findAIGenerationsByFeature = async (
  schoolId: Types.ObjectId,
  feature: string,
  page = 1,
  limit = 10
): Promise<{ data: IAIGeneration[]; total: number }> => {
  const skip = (page - 1) * limit;
  const query = { schoolId, feature };
  const [data, total] = await Promise.all([
    AIGeneration.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    AIGeneration.countDocuments(query),
  ]);
  return { data, total };
};