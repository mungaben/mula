"use client"
import { ColumnDef } from '@tanstack/react-table';
import { Config } from './config';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export const columns: ColumnDef<Config>[] = [
  {
    accessorKey: 'minWithdrawalAmount',
    header: 'Min Withdrawal Amount',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'withdrawalFeePercentage',
    header: 'Withdrawal Fee Percentage',
    cell: info => `${info.getValue() as number}%`,
  },
  {
    accessorKey: 'minBalance',
    header: 'Min Balance',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'level1Percentage',
    header: 'Level 1 Percentage',
    cell: info => `${info.getValue() as number}%`,
  },
  {
    accessorKey: 'level2Percentage',
    header: 'Level 2 Percentage',
    cell: info => `${info.getValue() as number}%`,
  },
  {
    accessorKey: 'level3Percentage',
    header: 'Level 3 Percentage',
    cell: info => `${info.getValue() as number}%`,
  },
  {
    accessorKey: 'linkLifetime',
    header: 'Link Lifetime (days)',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: info => new Date(info.getValue() as string).toLocaleDateString(),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: info => new Date(info.getValue() as string).toLocaleDateString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <ActionButtons configId={row.original.id} />
      // console.log("row",row.original.id)
    ),
  },
];

const ActionButtons = ({ configId }: { configId: string }) => {
  const router = useRouter();

  console.log("userid", configId);

  const handleEdit = () => {
    router.push(`/dashboard/config/${configId}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/config/${configId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Optionally, you can refresh the page or remove the user from the table
      router.refresh();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button className="text-blue-500" onClick={handleEdit}>
        Edit
      </Button>
      <Button className="text-red-200" variant={"destructive"} onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
};
