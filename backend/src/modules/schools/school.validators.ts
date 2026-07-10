import { z } from 'zod';

export const createSchoolSchema = z.object({
    body: z.object({
        name: z.string().min(2, 'School name must be at least 2 characters'),
        email: z.string().email('Invalid email address'),
        phone: z.string().min(5, 'Phone number is required'),
        address: z.string().min(5, 'Address is required'),
        city: z.string().min(2, 'City is required'),
        state: z.string().min(2, 'State is required'),
        country: z.string().default('Nigeria'),
        timezone: z.string().default('Africa/Lagos'),
        currency: z.string().default('NGN'),
        website: z.string().url('Invalid website URL').optional(),
            settings: z.object({
            gradingSystem: z.string().default('standard'),
            defaultLanguage: z.string().default('en'),
            allowStudentDownloads: z.boolean().default(true),
            allowParentPortal: z.boolean().default(false),
            branding: z.object({
                primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color').default('#3B82F6'),
                secondaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Invalid hex color').default('#10B981'),
            }).optional(),
        }).optional(),
    }),
});

export const updateSchoolSchema = z.object({
  body: createSchoolSchema.shape.body.partial(),
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid school ID'),
  }),
});