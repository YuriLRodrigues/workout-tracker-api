import { z } from 'zod';

export const envSchema = z.object({
  SERVICE: z.string(),
  VERSION: z.string().default('1.0.0'),
  PORT: z.string().default('7777'),
  FRONTEND_URLS: z.string(),
  DATABASE_URL: z.string(),
  MINIO_BUCKET_NAME: z.string(),
  MINIO_BUCKET_URL: z.string(),
  MINIO_ACCESS_KEY_ID: z.string(),
  MINIO_SECRET_ACCESS_KEY: z.string(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
