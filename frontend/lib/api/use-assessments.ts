"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAssessment,
  getAssessments,
  type CreateAssessmentPayload,
  type GetAssessmentsParams,
} from "@/lib/api/assessments";

const assessmentsKey = (params: GetAssessmentsParams) => ["assessments", params] as const;

export function useAssessments(params: GetAssessmentsParams = {}) {
  return useQuery({
    queryKey: assessmentsKey(params),
    queryFn: () => getAssessments(params),
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAssessmentPayload) => createAssessment(payload),
    onSuccess: () => {
      // Invalidate every assessments list query regardless of filter params.
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
  });
}
