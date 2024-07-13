import DepositForm from '@/app/components/DepositForm';
import DepositMForm from '@/app/components/DepositMForm';
import { ReferralLinkModal } from '@/app/components/GenerateReferralLink';
import { RedeemCode } from '@/app/components/Redeemcodes';
import { RequestWithdraw } from '@/app/components/RequestWithdraw';
import authOptions from '@/lib/configs/auth/authOptions';
import { getServerSession } from 'next-auth/next';
import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const ProfileLayout: React.FC<LayoutProps> = async({ children }) => {


  const session = await getServerSession(authOptions)
  
  return (
    <div className="min-h-screen w-full  bg-gradient-to-r from-[#0A493A] via-[#0A493A] to-[#0A493A] justify-items-center h-full">
      <div className="container max-w-screen-md mx-auto p-4 ">{children}</div>
      <div>
        <DepositMForm/>
      <RequestWithdraw  user={session?.user}/>
      <RedeemCode user={session?.user} />
      <ReferralLinkModal user={session?.user}  />
      </div>
    </div>
  );
};

export default ProfileLayout;
