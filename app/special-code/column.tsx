import { ColumnDef } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { getSession } from 'next-auth/react';

type SpecialCode = {
  id: string;
  code: string;
  totalAmount: number;
  redeemAmount: number;
  currentAmount: number;
  userId: string;
  createdAt: string;
  expiresAt: string;
  isExpired: boolean;
};

export const columns: ColumnDef<SpecialCode>[] = [
  {
    accessorKey: 'code',
    header: 'Code',
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total Amount',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'redeemAmount',
    header: 'Redeem Amount',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'currentAmount',
    header: 'Current Amount',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'expiresAt',
    header: 'Expires At',
    cell: info => new Date(info.getValue() as string).toLocaleString(),
  },
  {
    accessorFn: row => new Date(row.expiresAt) < new Date(),
    id: 'isExpired',
    header: 'Status',
    cell: info => info.getValue() ? 'Expired' : 'Active',
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: info => new Date(info.getValue() as string).toLocaleString(),
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionButtons codeId={row.original.id} />,
  },
];

const ActionButtons = ({ codeId }: { codeId: string }) => {
  const router = useRouter();

  const handleDeleteCode = async () => {
    const user = await getSession();
    const adminUserId = user?.user.id;
    const code = codeId;

    try {
      const response = await fetch(`/api/special-code/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, adminUserId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete code');
      }

      router.refresh();
      toast({
        title: 'Success!',
        description: 'Special code deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting code:', error);
      toast({
        title: 'Error!',
        description: 'Error deleting special code.',
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button className="text-blue-500" onClick={() => router.push(`/dashboard/special-code/${codeId}`)}>
        Edit
      </Button>
      <Button className="text-red-500" onClick={handleDeleteCode}>
        Delete
      </Button>
    </div>
  );
};
