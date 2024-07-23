'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { ScrollArea } from '@/components/ui/scroll-area';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { SpecialCodeForm, SpecialCodeFormValues } from '@/components/forms/SpecialCodeForm';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Special Codes', link: '/dashboard/special-codes' },
  { title: 'Edit Special Code', link: `/dashboard/special-codes/[codeId]` }
];

export default function Page() {
  const { codeId } = useParams<{ codeId: string }>();
  const [specialCodeData, setSpecialCodeData] = useState<SpecialCodeFormValues | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpecialCodeData = async () => {
      try {
        const response = await fetch(`/api/special-code/create/${codeId}`);
        const result = await response.json();
        setSpecialCodeData(result);

        
      } catch (error) {
        console.error('Error fetching special code data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (codeId) {
      fetchSpecialCodeData();
    } else {
      setLoading(false);
    }
  }, [codeId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <Breadcrumbs items={breadcrumbItems} />
        <SpecialCodeForm initialData={specialCodeData} codeId={codeId} />
      </div>
    </ScrollArea>
  );
}
