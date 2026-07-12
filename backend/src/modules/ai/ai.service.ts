import {
  createAIGeneration as createAIGenerationRepo,
  findAIGenerationById,
  findAllAIGenerations,
  findAIGenerationsByUser,
  findAIGenerationsByFeature,
} from './ai.repository.js';
import { IAIGeneration } from '../../shared/interfaces/base.interface.js';
import { AppError } from '../../middlewares/error.middleware.js';
import { Types } from 'mongoose';
import { env } from '../../config/env.js';

// AI Provider interfaces
interface AIProvider {
  generate(prompt: string, options?: any): Promise<string>;
}

// Mock AI providers - Replace with actual API calls
class OpenAIProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    // In production, call OpenAI API
    // const response = await openai.completions.create({ ... });
    return `Generated response for: ${prompt}`;
  }
}

class GeminiProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    // In production, call Gemini API
    return `Gemini response for: ${prompt}`;
  }
}

class AnthropicProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    // In production, call Anthropic API
    return `Anthropic response for: ${prompt}`;
  }
}

// Factory to get AI provider
const getAIProvider = (provider: string): AIProvider => {
  switch (provider) {
    case 'openai':
      return new OpenAIProvider();
    case 'gemini':
      return new GeminiProvider();
    case 'anthropic':
      return new AnthropicProvider();
    default:
      throw new AppError('Invalid AI provider', 400);
  }
};

// ============ AI Generation Services ============
export const generateWithAI = async (
  userId: Types.ObjectId,
  schoolId: Types.ObjectId,
  provider: string,
  model: string,
  feature: string,
  prompt: string,
  metadata: any = {}
): Promise<IAIGeneration> => {
  try {
    // Get the AI provider
    const aiProvider = getAIProvider(provider);

    // Generate response
    const response = await aiProvider.generate(prompt);

    // Calculate estimated cost (example)
    const estimatedCost = (prompt.length + response.length) * 0.001;

    // Create generation record
    const generationData = {
      userId,
      schoolId,
      provider: provider as any,
      model,
      feature: feature as any,
      prompt,
      response,
      metadata: {
        ...metadata,
        tokens: Math.ceil((prompt.length + response.length) / 4),
        estimatedCost,
      },
      status: 'completed' as const,
    };

    return createAIGenerationRepo(generationData);
  } catch (error) {
    // Log failed generation
    const generationData = {
      userId,
      schoolId,
      provider: provider as any,
      model,
      feature: feature as any,
      prompt,
      response: error instanceof Error ? error.message : 'Generation failed',
      metadata: {
        ...metadata,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      status: 'failed' as const,
    };

    return createAIGenerationRepo(generationData);
  }
};

export const getAIGenerationById = async (id: string): Promise<IAIGeneration> => {
  const generation = await findAIGenerationById(id);
  if (!generation) {
    throw new AppError('AI generation not found', 404);
  }
  return generation;
};

export const getAllAIGenerations = async (
  schoolId: Types.ObjectId,
  page = 1,
  limit = 10,
  filter: any = {}
) => {
  return findAllAIGenerations(schoolId, page, limit, filter);
};

export const getAIGenerationsByUser = async (
  userId: Types.ObjectId,
  page = 1,
  limit = 10
) => {
  return findAIGenerationsByUser(userId, page, limit);
};

export const getAIGenerationsByFeature = async (
  schoolId: Types.ObjectId,
  feature: string,
  page = 1,
  limit = 10
) => {
  return findAIGenerationsByFeature(schoolId, feature, page, limit);
};

// ============ AI Feature Helpers ============
export const generateQuestions = async (
  userId: Types.ObjectId,
  schoolId: Types.ObjectId,
  subjectId: string,
  topic: string,
  difficulty: string,
  count: number
): Promise<IAIGeneration> => {
  const prompt = `Generate ${count} ${difficulty} difficulty ${topic} questions for subject ${subjectId}`;
  return generateWithAI(
    userId,
    schoolId,
    'openai',
    'gpt-3.5-turbo',
    'question_generation',
    prompt,
    { subjectId, topic, difficulty, count }
  );
};

export const generateLessonPlan = async (
  userId: Types.ObjectId,
  schoolId: Types.ObjectId,
  subjectId: string,
  topic: string,
  duration: number
): Promise<IAIGeneration> => {
  const prompt = `Generate a ${duration}-minute lesson plan for ${topic} in subject ${subjectId}`;
  return generateWithAI(
    userId,
    schoolId,
    'openai',
    'gpt-3.5-turbo',
    'lesson_plan',
    prompt,
    { subjectId, topic, duration }
  );
};

export const generateMarkingScheme = async (
  userId: Types.ObjectId,
  schoolId: Types.ObjectId,
  assessmentId: string
): Promise<IAIGeneration> => {
  const prompt = `Generate a marking scheme for assessment ${assessmentId}`;
  return generateWithAI(
    userId,
    schoolId,
    'openai',
    'gpt-3.5-turbo',
    'marking_scheme',
    prompt,
    { assessmentId }
  );
};

export const generateFeedback = async (
  userId: Types.ObjectId,
  schoolId: Types.ObjectId,
  studentId: string,
  assessmentId: string,
  score: number
): Promise<IAIGeneration> => {
  const prompt = `Generate feedback for student ${studentId} who scored ${score}% on assessment ${assessmentId}`;
  return generateWithAI(
    userId,
    schoolId,
    'openai',
    'gpt-3.5-turbo',
    'feedback_generation',
    prompt,
    { studentId, assessmentId, score }
  );
};

export const generateStudyRecommendations = async (
  userId: Types.ObjectId,
  schoolId: Types.ObjectId,
  studentId: string
): Promise<IAIGeneration> => {
  const prompt = `Generate study recommendations for student ${studentId} based on their performance`;
  return generateWithAI(
    userId,
    schoolId,
    'openai',
    'gpt-3.5-turbo',
    'study_recommendation',
    prompt,
    { studentId }
  );
};