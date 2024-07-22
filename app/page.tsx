import React from 'react';
;

import DefaultLayout from './components/components/Layouts/DefaultLaout';
import ECommerce from './components/components/Dashboard/E-commerce';
import DepositMForm from './components/DepositMForm';
import WithdrawalRequestForm from './components/WithdrawalRequestForm';
import { ReferralLinkModal } from './components/GenerateReferralLink';
import { RequestWithdraw } from './components/RequestWithdraw';
import { RedeemCode } from './components/Redeemcodes';
import { Toaster } from '@/components/ui/toaster';



const Page = () => {
 
  return (
    // <div className="min-h-screen bg-gray-50">
    //   <Navbar />
    //   <main className="p-4 space-y-4">
    //     <div className="md:col-span-2 flex flex-col md:flex-row w-full justify-between items-center p-4 gap-4">
    //       <div className="flex-none w-full md:w-auto md:max-w-xs mb-4 md:mb-0 h-full border-card-foreground gap-2 space-y-5 shadow-md shadow-destructive-foreground">
    //         <Withdrawals />
         
    //       </div>
    //       <div className="flex-grow w-full">
    //         <AreaGraph />
    //       </div>
    //     </div>
    //     <div className="w-full">
    //       <Product />
    //     </div>
    //   </main>
    // </div>

    <DefaultLayout>
      <>
      <ECommerce />
      <DepositMForm/>
      <ReferralLinkModal/>
      <RequestWithdraw/>
      <RedeemCode/>
      <Toaster/>
    

      </>
    

  </DefaultLayout>
  );
};

export default Page;
