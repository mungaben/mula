"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import LoadingSpinner from '@/app/components/LoadingSpinner';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';

interface ModelClientProps<T> {
  apiEndpoint: string;
  model: string;
  columns: any;
  headingTitle: string;
  headingDescription: string;
  newEntityUrl: string;
}

export const ModelClient = <T,>({
  apiEndpoint,
  model,
  columns,
  headingTitle,
  headingDescription,
  newEntityUrl
}: ModelClientProps<T>) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();

        // Ensure the data is an array
        const formattedData = result.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));

        setData(formattedData);
        console.log("Fetched data:", formattedData);
      } catch (err: unknown) {
        console.error(`Error fetching ${model}:`, err);

        if (err instanceof Error) {
          setError(`Error fetching ${model}: ${err.message}`);
        } else {
          setError(`Error fetching ${model}: An unknown error occurred`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, model]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!data || data.length === 0) {
    return <div className="text-red-500">No data found</div>;
  }

  console.log("Data passed to DataTable:", data);

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`${headingTitle}`}
          description={headingDescription}
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(newEntityUrl)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
