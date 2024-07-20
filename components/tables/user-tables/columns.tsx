import { ColumnDef } from '@tanstack/react-table';
import { User } from './client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
  },
  {
    accessorKey: 'balance',
    header: 'Balance',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'totalDeposits',
    header: 'Total Deposits',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'totalWithdrawals',
    header: 'Total Withdrawals',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'totalInterest',
    header: 'Total Interest',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'totalCommissionsReceived',
    header: 'Total Commissions Received',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'totalCommissionsGiven',
    header: 'Total Commissions Given',
    cell: info => `Ksh ${info.getValue() as number}`,
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
    accessorKey: 'referralLink',
    header: 'Referral Link',
  },
  {
    accessorKey: 'referralLinkExpiry',
    header: 'Referral Link Expiry',
    cell: info => info.getValue() ? new Date(info.getValue() as string).toLocaleDateString() : '',
  },
  {
    accessorKey: 'referralLinksUsed',
    header: 'Referral Links Used',
    cell: info => (info.getValue() as any[]).length,
  },
  {
    accessorKey: 'products',
    header: 'Products',
    cell: info => (info.getValue() as any[]).map((product: any) => product.product.name).join(', '),
  },
  {
    accessorKey: 'promotionCodes',
    header: 'Promotion Codes',
    cell: info => (info.getValue() as any[]).map((code: any) => code.code).join(', '),
  },
  {
    accessorKey: 'awaitingDeposits',
    header: 'Awaiting Deposits',
    cell: info => (info.getValue() as any[]).length,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionButtons userId={row.original.id} />,
  },
];

const ActionButtons = ({ userId }: { userId: string }) => {
  const router = useRouter();

  const handleEdit = () => {
    router.push(`/dashboard/user/${userId}`);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
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