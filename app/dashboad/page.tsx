
import { UserLogged } from '@/lib/getUser';
import { getServerSession } from "next-auth/next"
import { redirect } from 'next/navigation';
import React from 'react';

const Page = async () => {

  
  return (
    <div className="w-full h-screen flex justify-center items-center color-alternate overflow-hidden">
      <div className="relative w-48 h-48 flex justify-center items-center md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 hover-effect">
        <div className="absolute  w-full h-full border-8 border-current rounded-full animate-spin-slow ripple-effect"></div>
        <div className="absolute w-full h-full flex justify-center items-center">
          <div className="absolute w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-56 xl:h-56 border-2 border-current rounded-full inner-circle animate-spin-slow"></div>
          <div className="text-6xl md:text-7xl lg:text-8xl font-bold shiny-text rounded-m">M</div>
        </div>
      </div>
    </div>
  );
}

export default Page;
