import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
} from "./school";

export const useSchools = () =>
  useQuery({
    queryKey: ["schools"],
    queryFn: getSchools,
  });

export const useSchool = (id: string) =>
  useQuery({
    queryKey: ["schools", id],
    queryFn: () => getSchoolById(id),
    enabled: !!id,
  });

export const useCreateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSchool,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["schools"],
      }),
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: any) => updateSchool(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["schools"],
      }),
  });
};

export const useDeleteSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSchool,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["schools"],
      }),
  });
};