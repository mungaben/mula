import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import authOptions from '@/lib/configs/auth/authOptions';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    console.log('Fetching server session...');
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      console.log('Unauthorized access attempt.');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    console.log(`Fetching user data for user ID: ${userId}`);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        deposits: true,
        withdrawals: {
          where: { status: 'APPROVED' },
        },
        interests: true,
        referrals: true,
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!user) {
      console.log('User not found.');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch the initial balance from config
    const config = await prisma.config.findFirst();
    const initialBalance = config?.initialBal || 0;

    // Calculate totals
    const totalDeposits = user.deposits.reduce((acc, deposit) => acc + (deposit.amount || 0), 0);
    const totalWithdrawals = user.withdrawals.reduce((acc, withdrawal) => acc + (withdrawal.amount || 0), 0);
    const totalInterest = user.interests.reduce((acc, interest) => acc + (interest.amount || 0), 0);
    const totalReferrals = user.referrals.length;
    const totalProductPurchases = user.products.reduce((acc, userProduct) => acc + (userProduct.product.price || 0), 0);

    // Calculate available balance (free money)
    const availableBalance = totalDeposits + totalInterest - totalWithdrawals - totalProductPurchases + initialBalance;

    const detailedUser = {
      id: user.id,
      name: user.name || 'N/A',
      email: user.email || 'N/A',
      phone: user.phone || 'N/A',
      balance: user.balance,
      totalDeposits,
      totalWithdrawals,
      totalInterest,
      totalReferrals,
      totalProductPurchases,
      initialBalance, // Include initial balance for frontend use if needed
    };

    console.log('Returning detailed user data:', detailedUser);
    return NextResponse.json(detailedUser, { status: 200 });
  } catch (error) {
    console.error('Internal server error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
