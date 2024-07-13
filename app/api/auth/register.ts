import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { registerReferral } from '@/lib/registerReferral'; // Assuming this function is defined elsewhere

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password, phone, referralLink } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    // Handle referral link if provided
    if (referralLink) {
      const referralResponse = await registerReferral(referralLink, user.id);
      if (referralResponse.error) {
        return res.status(400).json({ message: referralResponse.error });
      }
    }

    return res.status(201).json(user);
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
