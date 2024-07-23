'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Breadcrumbs } from '@/components/breadcrumbs';

import { ScrollArea } from '@/components/ui/scroll-area';
import { UserForm } from '@/components/forms/product-form';
import LoadingSpinner from '@/app/components/LoadingSpinner';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'User', link: '/dashboard/user' },
  { title: 'Edit User', link: `/dashboard/user/[userId]` }
];

export default function Page() {
  const { userId  } = useParams();
  console.log("user",userId)
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("user")
        const response = await fetch(`/api/Users/${userId}`);
        const result = await response.json();
        setUserData(result);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId ) {
      fetchUserData();
    }
  }, [userId ]);

  if (loading) {
    return <LoadingSpinner/>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-5">
        <Breadcrumbs items={breadcrumbItems} />
        <UserForm initialData={userData} />
      </div>
    </ScrollArea>
  );
}
