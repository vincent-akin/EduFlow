import type { AuthUser } from "@/lib/api/auth";

export const demoUsers: Record<string, AuthUser> = {
  school_admin: {
    id: "demo-admin",
    firstName: "Admin",
    lastName: "User",
    email: "admin@greenfield.edu",
    role: "school_admin",
  },
  teacher: {
    id: "demo-teacher",
    firstName: "Mrs.",
    lastName: "Johnson",
    email: "johnson@greenfield.edu",
    role: "teacher",
  },
  student: {
    id: "demo-student",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@greenfield.edu",
    role: "student",
  },
  parent: {
    id: "demo-parent",
    firstName: "Mrs.",
    lastName: "Adewale",
    email: "adewale@greenfield.edu",
    role: "parent",
  },
};
