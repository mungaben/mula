'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getSession } from 'next-auth/react';
import getuser from './getuser';
import useFetch from '@/lib/useFetch'; // Adjust the import path as needed
import { useState } from 'react';
import useModuleStore from '@/lib/storage/modules';

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
    accessorKey: 'growthPercentage',
    header: 'Growth Percentage',
    cell: info => `${info.getValue() as number}%`,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionButtons productId={row.original.id} />,
  },
];

const ActionButtons = ({ productId }: { productId: string }) => {
  const { depositModule, toggleDepositModule } = useModuleStore();
  const router = useRouter();
  const { data, error, isLoading } = useFetch<{ isPurchased: boolean; hasEnoughBalance: boolean }>(`/api/products/${productId}/isPurchased`);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [belowbalance, setBelowBalance] = useState(false);

  const handleBuyProduct = async () => {
    setButtonClicked(true);
    const session = await getuser();

    if (!session) {
      toast({
        title: 'Error!',
        description: 'You must be logged in to buy a product.',
      });
      setButtonClicked(false);
      return;
    }

    if (!data?.hasEnoughBalance) {
      toast({
        title: 'Insufficient Balance',
        description: 'You do not have enough balance to buy this product. Please add balance to proceed.',
      });
      setBelowBalance(true);
      setButtonClicked(false);
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: 'Error!',
          description: errorData.error || 'Failed to buy product',
        });
        setButtonClicked(false);
        return;
      }

      toast({
        title: 'Success!',
        description: 'Product purchased successfully.',
      });
      router.push('/dashboard/Profile');
    } catch (error) {
      console.error('Error buying product:', error);
      let errorMessage = 'An unexpected error occurred';

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: 'Error!',
        description: errorMessage,
      });
      setButtonClicked(false);
    }
  };

  if (isLoading) {
    return <Button className="text-green-500" disabled>Loading...</Button>;
  }

  if (error) {
    return <Button className="text-red-500" disabled>Error</Button>;
  }

  const isPurchased = data?.isPurchased ?? false;

  return (
    <div className="flex space-x-2">
      <Button
        className="text-green-500"
        onClick={handleBuyProduct}
        disabled={isPurchased || buttonClicked || belowbalance}
      >
        {isPurchased ? 'Purchased' : 'Buy'}
      </Button>
      {belowbalance && (
        <Button
          className="text-blue-500"
          onClick={() =>toggleDepositModule() }
        >
          Add Balance
        </Button>
      )}
    </div>
  );
};
