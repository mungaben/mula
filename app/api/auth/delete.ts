// app/api/auth/delete.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    await prisma.user.delete({
      where: { id: session.user.id },
    });

    return res.status(200).json({ message: 'Account deleted' });
  } else {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

