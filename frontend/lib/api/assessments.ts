import { authedRequest, authedRequestPaginated, type ApiListMeta } from "@/lib/api/client";

/**
 * NOTE ON FIELD NAMES: the API doc (§12) documents the *create* payload in
 * full but doesn't show a sample response body for GET /assessments. This
 * DTO is inferred from the create payload plus the fields every list/detail
 * view needs (id, status, timestamps). Once you can hit the real endpoint,
 * compare a real response against this type and adjust — that mismatch is
 * the most likely first thing to fix during integration.
 */
export interface AssessmentDto {
  _id: string;
  title: string;
  description?: string;
  type: "test" | "exam" | "quiz" | "assignment" | "practical";
  deliveryMode: "cbt" | "printable";
  status: "draft" | "published" | "closed";
  classId: string;
  subjectId: string;
  sessionId: string;
  termId: string;
  durationMinutes: number;
  passMark: number;
  startTime: string;
  endTime: string;
  submissionsCount?: number;
  totalStudents?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssessmentPayload {
  sessionId: string;
  termId: string;
  classId: string;
  subjectId: string;
  title: string;
  description?: string;
  type: AssessmentDto["type"];
  deliveryMode: AssessmentDto["deliveryMode"];
  instructions?: string;
  durationMinutes: number;
  passMark: number;
  shuffleQuestions?: boolean;
  shuffleOptions?: boolean;
  allowReview?: boolean;
  startTime: string;
  endTime: string;
  questions?: { questionId: string; order: number; marks: number }[];
}

export interface GetAssessmentsParams {
  page?: number;
  limit?: number;
  classId?: string;
  subjectId?: string;
  status?: string;
  type?: string;
}

function toQueryString(params: Record<string, string | number | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") search.set(key, String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export async function getAssessments(
  params: GetAssessmentsParams = {}
): Promise<{ assessments: AssessmentDto[]; meta: ApiListMeta | null }> {
  const { data, meta } = await authedRequestPaginated<AssessmentDto[]>(
    `/assessments${toQueryString({ ...params })}`
  );
  return { assessments: data, meta };
}

export async function createAssessment(
  payload: CreateAssessmentPayload
): Promise<AssessmentDto> {
  return authedRequest<AssessmentDto>("/assessments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function publishAssessment(id: string): Promise<AssessmentDto> {
  return authedRequest<AssessmentDto>(`/assessments/${id}/publish`, {
    method: "PATCH",
  });
}

export async function deleteAssessment(id: string): Promise<void> {
  return authedRequest<void>(`/assessments/${id}`, { method: "DELETE" });
}
