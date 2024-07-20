import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/configs/auth/authOptions';
// Adjust the import path as needed

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        deposits: true,
        withdrawals: {
          where: { status: 'APPROVED' },
        },
        interests: true,
        referrals: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const totalDeposits = user.deposits.reduce((acc, deposit) => acc + deposit.amount, 0);
    const totalWithdrawals = user.withdrawals.reduce((acc, withdrawal) => acc + withdrawal.amount, 0);
    const totalInterest = user.interests.reduce((acc, interest) => acc + interest.amount, 0);
    const totalReferrals = user.referrals.length; // Counting the number of referrals

    const detailedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      balance: user.balance,
      totalDeposits,
      totalWithdrawals,
      totalInterest,
      totalReferrals,
    };

    return NextResponse.json(detailedUser, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
