"use client";
import Product from "@/app/products/Product";
import useFetch from "@/lib/useFetch";
import { Product as prodx } from "@prisma/client";
import React, { useState } from "react";
import Loader from "../common/Loader";
import DataStatsOne from "../DataStats/DataStatsOne";

const ECommerce: React.FC = () => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log("use daa in ecommercer",user);




  

  const { data, error, isLoading } = useFetch<prodx[]>('api/products/userProducts')

  if (isLoading) {
    return <Loader/>;
  }

 

  return (
    <>
      <DataStatsOne />

      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">

        <div className="col-span-12 xl:col-span-12">
          <Product/> 
        </div>

      </div>
    </>
  );
};

export default ECommerce;
