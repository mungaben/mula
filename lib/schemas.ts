// lib/schemas.ts
import { z } from 'zod';

export const specialCodeSchema = z.object({
  totalAmount: z.number().positive(), // Total redeemable amount
  redeemAmount: z.number().positive(), // Amount each user gets
  expiresAt: z.date(),
  userId: z.string().optional(),
});

export const specialCodeWithIdSchema = specialCodeSchema.extend({
  id: z.string().optional(),
});

export const redeemCodeSchema = z.object({
  code: z.string(),
  userId: z.string(),
});

export const referralLinkSchema = z.object({
  userId: z.string(),
});



// types.ts
export type ModuleState = {
  depositModule: boolean;
  withdrawModule: boolean;
  redeemCodeModule: boolean;
  referralLinkModule:boolean;
};

export type ModuleActions = {
  toggleDepositModule: () => void;
  toggleWithdrawModule: () => void;
  toggleRedeemCodeModule: () => void;
  toggleReferralLinkModule:() => void;
};

export type ModuleStore = ModuleState & ModuleActions;

