'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';

import LoadingSpinner from '@/app/components/LoadingSpinner';
import { ProductForm, ProductFormValues } from '@/components/forms/Userproduct';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Products', link: '/dashboard/product' },
  { title: 'Edit Product', link: `/dashboard/product/[productId]` }
];

export default function Page() {
  const { productId } = useParams<{ productId: string }>();
  console.log("product id",productId);
  
  const [productData, setProductData] = useState<ProductFormValues | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        const result = await response.json();
        setProductData(result);
      } catch (error) {
        console.error('Error fetching product data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductData();
    } else {
      setLoading(false);
    }
  }, [productId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <Breadcrumbs items={breadcrumbItems} />
        <ProductForm initialData={productData} productId={productId} />
      </div>
    </ScrollArea>
  );
}
