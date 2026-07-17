import { authedRequest } from "./client";

export interface School {
  _id: string;
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  currency?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolDto {
  name: string;
  slug: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
  currency?: string;
}

export interface UpdateSchoolDto
  extends Partial<CreateSchoolDto> {}

export const getSchools = () =>
  authedRequest<School[]>("/schools");

export const getSchoolById = (id: string) =>
  authedRequest<School>(`/schools/${id}`);

export const getSchoolBySlug = (slug: string) =>
  authedRequest<School>(`/schools/slug/${slug}`);

export const createSchool = (
  data: CreateSchoolDto
) =>
  authedRequest<School>("/schools", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateSchool = (
  id: string,
  data: UpdateSchoolDto
) =>
  authedRequest<School>(`/schools/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteSchool = (id: string) =>
  authedRequest<void>(`/schools/${id}`, {
    method: "DELETE",
  });

export const permanentlyDeleteSchool = (
  id: string
) =>
  authedRequest<void>(`/schools/${id}/permanent`, {
    method: "DELETE",
  });