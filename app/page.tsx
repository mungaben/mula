import React from 'react';
import WalletBalance from '../components/homepage/WalletBalance';
import Portfolio from '../components/homepage/Portfolio';
import Header from '../components/homepage/Header';
import Navbar from '../components/homepage/Navbar';
import Withdrawals from '@/components/homepage/Withdrawals';
import WalletList from '@/components/homepage/WaletBalance';
import { AreaGraph } from '@/components/charts/area-graph';
import Product from '@/app/products/Product';

const Page = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-4 space-y-4">
        <div className="md:col-span-2 flex flex-col md:flex-row w-full justify-between items-center p-4 gap-4">
          <div className="flex-none w-full md:w-auto md:max-w-xs mb-4 md:mb-0 h-full border-card-foreground gap-2 space-y-5 shadow-md shadow-destructive-foreground">
            <Withdrawals />
            <Withdrawals />
            <Withdrawals />
            <Withdrawals />
          </div>
          <div className="flex-grow w-full">
            <AreaGraph />
          </div>
        </div>
        <div className="w-full">
          <Product />
        </div>
      </main>
    </div>
  );
};

export default Page;
