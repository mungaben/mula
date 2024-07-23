"use client"


import { ColumnDef } from '@tanstack/react-table';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Deposit, WithdrawalRequest } from '@prisma/client';
import { toast } from '@/components/ui/use-toast';

export const columns: ColumnDef<WithdrawalRequest>[] = [
  {
    accessorKey: 'user.name',
    header: 'User Name',
  },
  {
    accessorKey: 'user.phone',
    header: 'Phone',
  },
  {
    accessorKey: 'user.deposits',
    header: 'Total Deposits',
    cell: info => {
      const deposits = info.getValue() as Deposit[];
      const totalDeposits = deposits.reduce((total, deposit) => total + deposit.amount, 0);
      return `Ksh ${totalDeposits}`;
    },
  },
  {
    accessorKey: 'amount',
    header: 'Request Amount',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'user.balance',
    header: 'Balance',
    cell: info => `Ksh ${info.getValue() as number}`,
  },
  {
    accessorKey: 'user.role',
    header: 'Role',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ActionButtons requestId={row.original.id} />,
  },
];

const ActionButtons = ({ requestId }: { requestId: string }) => {
  const router = useRouter();

  const handleUpdateStatus = async (status: 'REQUESTED' | 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch("/api/withdrawal/request", {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: requestId, status }),
      });
      console.log("response given",response);
      

      if (!response.ok) {
        throw new Error('Failed to update withdrawal request status');
      }

      router.refresh();
      toast({
        title: 'Success!',
        description: 'User updated successfully.',
      });
    } catch (error) {
      console.error('Error updating withdrawal request status:', error);
      toast({
        title: 'Error!',
        description: 'Error updating withdrawal request status.',
      });
    }
  };

  return (
    <div className="flex space-x-2">
      <Button className="text-green-500" onClick={() => handleUpdateStatus('APPROVED')}>
        Approve
      </Button>
      <Button className="text-yellow-500" onClick={() => handleUpdateStatus('REQUESTED')}>
        Request
      </Button>
      <Button className="text-red-500" onClick={() => handleUpdateStatus('REJECTED')}>
        Reject
      </Button>
    </div>
  );
};
