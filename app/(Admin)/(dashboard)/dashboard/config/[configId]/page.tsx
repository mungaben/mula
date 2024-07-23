'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';

import { ScrollArea } from '@/components/ui/scroll-area';

import LoadingSpinner from '@/app/components/LoadingSpinner';
import { ConfigForm } from '@/components/forms/config-form';
import { Config } from '@/components/tables/config-tables/config';


const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Configuration', link: '/dashboard/config' },
  { title: 'Edit Configuration', link: `/dashboard/config/[config]` }
];

export default function Page() {
  const { configId } = useParams();
  console.log("Config ID:", configId);
  const [configData, setConfigData] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfigData = async () => {
      try {
        const response = await fetch(`/api/config`);
        if (!response.ok) {
          throw new Error('Failed to fetch configuration data');
        }
        const result = await response.json();
        setConfigData(result);
      } catch (error) {
        console.error('Error fetching configuration data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (configId) {
      fetchConfigData();
    }
  }, [configId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <Breadcrumbs items={breadcrumbItems} />
        <ConfigForm initialData={configData} />
      </div>
    </ScrollArea>
  );
}
