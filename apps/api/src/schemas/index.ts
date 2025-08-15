import { z } from 'zod'
enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google', 
  APPLE = 'apple'
}

// User Schemas
export const userSubscriptionSchema = z.object({
  plan: z.enum(['FREE', 'PRO', 'ENTERPRISE']).default('FREE'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'TRIAL']).default('ACTIVE'),
  expiresAt: z.date().optional(),
})

export const createUserSchema = z.object({
  googleId: z.string().optional(),
  appleId: z.string().optional(),
  email: z.string().email(),
  name: z.string().min(1),
  profilePicture: z.string().url().optional(),
  authProvider: z.nativeEnum(AuthProvider),
})

export const userRegistrationSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  password: z.string().min(8),
})

// Auth Schemas
export const googleSignInSchema = z.object({
  idToken: z.string(),
})

export const appleSignInSchema = z.object({
  idToken: z.string(),
})

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
})

// Export Schemas
export const exportOptionsSchema = z.object({
  format: z.enum(['json', 'csv']).default('json'),
  categoryIds: z.array(z.string()).optional(),
  includeTags: z.array(z.string()).optional(),
  excludePrivate: z.boolean().default(false),
})

// Import Schemas
export const importDataSchema = z.object({
  categories: z.array(z.object({
    name: z.string(),
    description: z.string().optional(),
    icon: z.string().optional(),
    color: z.string().optional(),
  })).optional(),
  preferences: z.array(z.object({
    categoryName: z.string(),
    name: z.string(),
    value: z.union([z.string(), z.number(), z.boolean(), z.object({}).passthrough()]),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    isPrivate: z.boolean().default(false),
    priority: z.number().int().min(1).max(5).default(3),
  })),
})

// Validation helper types
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>
export type GoogleSignInInput = z.infer<typeof googleSignInSchema>
export type AppleSignInInput = z.infer<typeof appleSignInSchema>
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>
export type ExportOptionsInput = z.infer<typeof exportOptionsSchema>
export type ImportDataInput = z.infer<typeof importDataSchema>