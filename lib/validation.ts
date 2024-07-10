import { z } from 'zod';

export const specialCodeSchema = z.object({
  totalAmount: z
    .number()
    .positive('Total amount must be a positive number.')
    .min(0.01, 'Total amount must be greater than zero.'),
  redeemAmount: z
    .number()
    .positive('Redeem amount must be a positive number.')
    .min(0.01, 'Redeem amount must be greater than zero.'),
  expiresAt: z
    .string()
    .refine((val) => new Date(val) > new Date(), {
      message: 'Expiration date must be a future date.',
    }),
}).superRefine((data, ctx) => {
  if (data.redeemAmount >= data.totalAmount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Redeem amount must be less than the total amount.',
      path: ['redeemAmount'],
    });
  }
});
