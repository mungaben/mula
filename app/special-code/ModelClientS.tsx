"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { Heading } from '@/components/ui/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import LoadingSpinner from '../components/LoadingSpinner';

interface SpecialCodeClientProps {
  apiEndpoint: string;
  model: string;
  columns: any;
  headingTitle: string;
  headingDescription: string;
  newEntityUrl: string;
}

export const SpecialCodeClient: React.FC<SpecialCodeClientProps> = ({
  apiEndpoint,
  model,
  columns,
  headingTitle,
  headingDescription,
  newEntityUrl,
}) => {
  const [data, setData] = useState<any[]>([]);
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

        // Ensure the data is an array and format the dates
        const formattedData = result.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          expiresAt: new Date(item.expiresAt),
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
    return <LoadingSpinner/>;
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
      <div className="flex items-start justify-between mb-4">
        <div>
          <Heading
            title={headingTitle}
            description={headingDescription}
          />
        </div>
        <Button onClick={() => router.push(newEntityUrl)}>
          <Plus className="mr-2" /> Create New {model}
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="code" columns={columns} data={data} />
    </>
  );
};
