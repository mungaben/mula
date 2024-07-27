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
  DaysToExpire?: number;
  earningPer24Hours?: number;
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
    cell: info => {
      const product = info.row.original;
      const dailyEarnings =
        product.earningPer24Hours ??
        product.price * (product.growthPercentage / 100);
      return `Ksh ${dailyEarnings.toFixed(2)}`;
    },
  },
  {
    accessorKey: 'growthPercentage',
    header: 'Growth Percentage',
    cell: info => `${info.getValue() as number}%`,
  },
  {
    accessorKey: 'DaysToExpire',
    header: 'Days to Expire',
    cell: info => `${info.getValue() ?? 'N/A'}`,
  },
  {
    accessorKey: 'totalEarnings',
    header: 'Total Earnings',
    cell: info => {
      const product = info.row.original;
      const dailyEarnings =
        product.earningPer24Hours ??
        product.price * (product.growthPercentage / 100);
      const totalDays = product.DaysToExpire ?? 'N/A';
      const totalEarnings =
        typeof totalDays === 'number'
          ? (dailyEarnings * totalDays).toFixed(2)
          : 'N/A';
      return `Ksh ${totalEarnings}`;
    },
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

  // Fetch purchase and balance status
  const { data, error, isLoading } = useFetch<{
    isPurchased: boolean;
    hasEnoughBalance: boolean;
    isExpired: boolean; // Added to determine if product is expired
  }>(`/api/products/${productId}/isPurchased`);

  const [buttonClicked, setButtonClicked] = useState(false);
  const [belowBalance, setBelowBalance] = useState(false);

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
        description:
          'You do not have enough balance to buy this product. Please add balance to proceed.',
      });
      setBelowBalance(true);
      setButtonClicked(false);
      return;
    }

    try {
      const response = await fetch(`/api/products/${productId}/Buy`, {
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

      // Redirect to the homepage or refresh the page
      router.push('/');
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
    return (
      <Button className="text-green-500" disabled>
        Loading...
      </Button>
    );
  }

  if (error) {
    return (
      <Button className="text-red-500" disabled>
        Error
      </Button>
    );
  }

  const isPurchased = data?.isPurchased ?? false;
  const isExpired = data?.isExpired ?? false;

  return (
    <div className="flex space-x-2">
      <Button
        className={`text-${isPurchased && !isExpired ? 'gray' : 'green'}-500`}
        onClick={handleBuyProduct}
        disabled={(isPurchased && !isExpired) || buttonClicked || belowBalance}
      >
        {isPurchased && !isExpired ? 'Purchased' : 'Buy'}
      </Button>
      {belowBalance && (
        <Button className="text-blue-500" onClick={() => toggleDepositModule()}>
          Add Balance
        </Button>
      )}
    </div>
  );
};
