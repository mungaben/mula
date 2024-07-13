'use server';

import { PrismaClient } from '@prisma/client';
import { randomBytes } from 'crypto'; // Use crypto for generating unique codes
import { specialCodeSchema, redeemCodeSchema } from '@/lib/schemas';
import { sendNotification } from '@/lib/notification';
import { z } from 'zod';

const prisma = new PrismaClient();

// Generate a unique code using crypto
export const generateUniqueCode = (): string => {
  return randomBytes(5).toString('hex'); // Generates a 10-character hex string
};

// Create a new special code
export const createSpecialCode = async (data: z.infer<typeof specialCodeSchema>) => {
  specialCodeSchema.parse(data); // Validate input data

  const { totalAmount, redeemAmount, expiresAt, userId } = data;

  const code = await  generateUniqueCode(); // Ensure this is called synchronously

  console.log('Generated code:', code);
  console.log('Data being passed to Prisma:', {
    code,
    totalAmount,
    redeemAmount,
    currentAmount: 0, // Initialize currentAmount
    expiresAt,
    userId,
  });

  const specialCode = await prisma.specialCode.create({
    data: {
      code,
      totalAmount,
      redeemAmount,
      currentAmount: 0, // Initialize currentAmount
      expiresAt,
      userId,
    },
  });

  if (!specialCode) {
    throw new Error("Special code not created");
  }

  return specialCode;
};

// Validate a special code
export const validateSpecialCode = async (code: string) => {


  console.log("code",code);
  
  const specialCode = await prisma.specialCode.findUnique({
    where: { code },
  });

  if (!specialCode) {
    throw new Error('Invalid code.');
  }

  if (new Date() > specialCode.expiresAt) {
    throw new Error('Code has expired.');
  }

  if (specialCode.currentAmount >= specialCode.totalAmount) {
    throw new Error('Code amount has been exhausted.');
  }

  return specialCode;
};

// Redeem a special code
export const redeemSpecialCode = async (data: z.infer<typeof redeemCodeSchema>) => {

  console.log("edeemSpecialCode",data);
  
  redeemCodeSchema.parse(data); // Validate input data



  const { code, userId } = data;
  const specialCode = await validateSpecialCode(code);

  if (specialCode.userId) {
    throw new Error('Code has already been redeemed.');
  }

  // Check if user has already redeemed the code
  const userRedemption = await prisma.specialCode.findFirst({
    where: {
      code,
      userId,
    },
  });

  if (userRedemption) {
    throw new Error('User has already redeemed this code.');
  }

  // Update the special code with the user who redeemed it
  const redeemedCode = await prisma.specialCode.update({
    where: { code },
    data: {
      userId,
      currentAmount: {
        increment: specialCode.redeemAmount,
      },
    },
  });

  // Update the user's balance
  await prisma.user.update({
    where: { id: userId },
    data: { balance: { increment: specialCode.redeemAmount } },
  });

  // Send notification to user
  await sendNotification(userId, 'Special code redeemed', `You have redeemed the special code worth ${specialCode.redeemAmount}`, 'SUCCESS');

  // Check if the total amount is exhausted
  if (redeemedCode.currentAmount >= specialCode.totalAmount) {
    // Deactivate the code
    await prisma.specialCode.update({
      where: { code },
      data: { totalAmount: 0 },
    });

    // Notify the user
    await sendNotification(userId, 'Special code exhausted', 'The special code amount has been exhausted and is now deactivated.', 'WARNING');
  }

  return redeemedCode;
};

// Delete a special code (Admin only)
export const deleteSpecialCode = async (code: string, adminUserId: string) => {
  // Check if the user is an admin
  const adminUser = await prisma.user.findUnique({
    where: { id: adminUserId },
  });

  if (!adminUser || adminUser.role !== 'ADMIN') {
    throw new Error('Unauthorized action. Only admins can delete special codes.');
  }

  const specialCode = await prisma.specialCode.findUnique({
    where: { code },
  });

  if (!specialCode) {
    throw new Error('Special code not found.');
  }

  await prisma.specialCode.delete({
    where: { code },
  });

  // Send notification to the admin
  await sendNotification(adminUserId, 'Special code deleted', `Special code ${code} has been deleted.`, 'INFO');

  return { message: 'Special code deleted successfully.' };
};

// Get all active special codes
export const getActiveSpecialCodes = async () => {
  const activeSpecialCodes = await prisma.specialCode.findMany({
    where: {
      expiresAt: {
        gt: new Date(), // Only fetch codes where expiresAt is greater than the current date
      },
      userId: null, // Ensure the code has not been redeemed
    },
  });

  return activeSpecialCodes;
};

// Get all special codes
export const getAllSpecialCodes = async () => {
  const allSpecialCodes = await prisma.specialCode.findMany();
  return allSpecialCodes;
};
