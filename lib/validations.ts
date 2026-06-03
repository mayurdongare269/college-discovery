import { z } from 'zod';

export const collegeSearchSchema = z.object({
  search: z.string().optional(),
  state: z.string().optional(),
  examType: z.enum(['MHT_CET', 'JEE_MAIN']).optional(),
  course: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const collegeSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(1),
  location: z.string().min(1),
  state: z.string().min(1),
  type: z.string().min(1),
  ownership: z.string().min(1),
  fees: z.number().min(0),
  rating: z.number().min(0).max(5),
  placementScore: z.number().min(0).max(100),
  nirfRank: z.number().nullable(),
  website: z.string().url().nullable(),
  establishedYear: z.number().min(1800).max(new Date().getFullYear()),
});

export const courseSchema = z.object({
  name: z.string().min(1),
  duration: z.number().min(1).max(6),
  seats: z.number().min(1),
  collegeId: z.number(),
});

export const cutoffSchema = z.object({
  examType: z.enum(['MHT_CET', 'JEE_MAIN']),
  category: z.enum(['OPEN', 'OBC', 'EWS', 'SC', 'ST']),
  branch: z.string().min(1),
  cutoffScore: z.number().min(0).max(100),
  year: z.number().min(2020).max(2030),
  courseId: z.number(),
});

export type CollegeSearchInput = z.infer<typeof collegeSearchSchema>;
export type CollegeInput = z.infer<typeof collegeSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type CutoffInput = z.infer<typeof cutoffSchema>;
