'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Plus } from 'lucide-react';
import LoadingSpinner from '@/app/components/LoadingSpinner';


export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  balance: number;
  role: string;
  referralLink?: string;
  referralLinkExpiry?: Date;
  referredBy?: string;
  deposits: any[];
  withdrawals: any[];
  interests: any[];
  commissionsReceived: any[];
  commissionsGiven: any[];
  referrals: any[];
  promotionRequests: any[];
  notifications: any[];
  promotionCodes: any[];
  awaitingDeposits: any[];
  specialCodes: any[];
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
  referralLinksUsed: any[];
  totalDeposits: number;
  totalWithdrawals: number;
  totalInterest: number;
  totalCommissionsReceived: number;
  totalCommissionsGiven: number;
  products: any[];
}

export const UserClient: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/Users');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <div className="flex items-start justify-between">
        <Heading
          title={`Users (${data.length})`}
          description="Manage users (Client side table functionalities.)"
        />
        <Button
          className="text-xs md:text-sm"
          onClick={() => router.push(`/dashboard/user/new`)}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
