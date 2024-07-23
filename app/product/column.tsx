'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

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

const ActionButtons = ({ productId }: { productId: string }) => {
  const router = useRouter();

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      router.refresh();
      toast({
        title: 'Success!',
        description: 'Product deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error!',
        description: 'Error deleting product.',
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button className="text-blue-500" onClick={() => router.push(`/dashboard/product/${productId}`)}>
        Edit
      </Button>
      <Button className="text-red-500" onClick={handleDeleteProduct}>
        Delete
      </Button>
    </div>
  );
};
