'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getSession } from 'next-auth/react';

type Product = {
  id: string;
  name: string;
  price: number;
  earningPer24Hours: number;
  growthPercentage: number;
  subscribersCount: number;
  createdAt: string;
  updatedAt: string;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Product Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'earningPer24Hours',
    header: 'Earnings per 24 Hours',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'growthPercentage',
    header: 'Growth Percentage',
    cell: info => `${info.getValue() as number}%`,
  },
  {
    accessorKey: 'subscribersCount',
    header: 'Subscribers Count',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: info => new Date(info.getValue() as string).toLocaleString(),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: info => new Date(info.getValue() as string).toLocaleString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionButtons productId={row.original.id} />,
  },
];

const ActionButtons = async ({ productId }: { productId: string }) => {
  const router = useRouter();
  const session = await getSession()

  const handleBuyProduct = async () => {
    if (!session?.user?.id) {
      toast({
        title: 'Error!',
        description: 'You must be logged in to buy a product.',
      });
      return;
    }

    try {
      // console.log('Sending productId:', productId); // Debugging line
      // console.log('Sending userId:', session.user.id); // Debugging line
      const response = await fetch(`/api/products/${productId}/Buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to buy product');
      }

      toast({
        title: 'Success!',
        description: 'Product purchased successfully.',
      });
      router.push('/dashboad/Profile');
    } catch (error) {
      console.error('Error buying product:', error);
      let errorMessage = 'An unexpected error occurred';

      // Type guard to narrow down the type of `error`
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error!',
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex space-x-2">
      {/* <Button className="text-blue-500" onClick={() => router.push(`/dashboard/product/${productId}`)}>
        Details
      </Button> */}
      <Button className="text-green-500" onClick={handleBuyProduct}>
        Buy
      </Button>
    </div>
  );
};
