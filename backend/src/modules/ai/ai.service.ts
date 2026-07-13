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

// ============ Type Definitions ============
interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  error?: {
    message: string;
  };
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
  error?: {
    message: string;
  };
}

interface AnthropicResponse {
  content?: {
    text?: string;
  }[];
  error?: {
    message: string;
  };
}

// ============ AI Provider Interfaces ============
interface AIProvider {
  generate(prompt: string, options?: any): Promise<string>;
}

// ============ OpenAI Provider ============
class OpenAIProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    if (!env.OPENAI_API_KEY) {
      throw new AppError('OpenAI API key not configured', 500);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      const data = await response.json() as OpenAIResponse;

      if (!response.ok) {
        const errorMessage = data.error?.message || 'Unknown OpenAI error';
        throw new AppError(`OpenAI API error: ${errorMessage}`, response.status);
      }

      if (!data.choices?.[0]?.message?.content) {
        throw new AppError('No response generated from OpenAI', 500);
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof AppError) throw error;
      const errorMessage = error instanceof Error ? error.message : 'Unknown OpenAI error';
      throw new AppError(`OpenAI API error: ${errorMessage}`, 500);
    }
  }
}

// ============ Gemini Provider ============
class GeminiProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    if (!env.GEMINI_API_KEY) {
      throw new AppError('Gemini API key not configured', 500);
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await response.json() as GeminiResponse;

      if (!response.ok) {
        const errorMessage = data.error?.message || 'Unknown Gemini error';
        throw new AppError(`Gemini API error: ${errorMessage}`, response.status);
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new AppError('No response generated from Gemini', 500);
      }

      return text;
    } catch (error) {
      if (error instanceof AppError) throw error;
      const errorMessage = error instanceof Error ? error.message : 'Unknown Gemini error';
      throw new AppError(`Gemini API error: ${errorMessage}`, 500);
    }
  }
}

// ============ Anthropic Provider ============
class AnthropicProvider implements AIProvider {
  async generate(prompt: string): Promise<string> {
    if (!env.ANTHROPIC_API_KEY) {
      throw new AppError('Anthropic API key not configured', 500);
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      const data = await response.json() as AnthropicResponse;

      if (!response.ok) {
        const errorMessage = data.error?.message || 'Unknown Anthropic error';
        throw new AppError(`Anthropic API error: ${errorMessage}`, response.status);
      }

      const text = data.content?.[0]?.text;
      if (!text) {
        throw new AppError('No response generated from Anthropic', 500);
      }

      return text;
    } catch (error) {
      if (error instanceof AppError) throw error;
      const errorMessage = error instanceof Error ? error.message : 'Unknown Anthropic error';
      throw new AppError(`Anthropic API error: ${errorMessage}`, 500);
    }
  }
}

// ============ Provider Factory ============
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

    // Calculate estimated cost (example - adjust based on actual token usage)
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
    const errorMessage = error instanceof Error ? error.message : 'Generation failed';
    
    const generationData = {
      userId,
      schoolId,
      provider: provider as any,
      model,
      feature: feature as any,
      prompt,
      response: errorMessage,
      metadata: {
        ...metadata,
        error: errorMessage,
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
  const prompt = `Generate ${count} ${difficulty} difficulty ${topic} questions for subject ${subjectId}. Include both MCQ and theory questions. For MCQ, provide 4 options with the correct answer marked. For theory, provide a sample answer.`;
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
  const prompt = `Generate a detailed ${duration}-minute lesson plan for ${topic} in subject ${subjectId}. Include learning objectives, materials needed, introduction, main activities, assessment, and closure.`;
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
  const prompt = `Generate a comprehensive marking scheme for assessment ${assessmentId}. Include marking criteria, point allocation, and model answers for each question.`;
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
  const prompt = `Generate constructive feedback for student ${studentId} who scored ${score}% on assessment ${assessmentId}. Include strengths, areas for improvement, and specific recommendations.`;
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
  const prompt = `Generate personalized study recommendations for student ${studentId} based on their academic performance. Include subject-specific strategies, time management tips, and resources.`;
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