import { z } from 'zod';

export const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  role: z.string(),
  avatar: z.string().optional(),
  blurHash: z.string().optional(),
  name: z.string(),
  email: z.string().email(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;
