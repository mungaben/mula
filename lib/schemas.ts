// lib/schemas.ts
import { z } from 'zod';

export const specialCodeSchema = z.object({
  totalAmount: z.number().positive(), // Total redeemable amount
  redeemAmount: z.number().positive(), // Amount each user gets
  expiresAt: z.date(),
  userId: z.string().optional(),
});

export const redeemCodeSchema = z.object({
  code: z.string(),
  userId: z.string(),
});
