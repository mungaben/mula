"use client"


import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Edit, Delete } from 'lucide-react';

const ActionButtons = ({ configId }: { configId: string }) => {
  const router = useRouter();


  console.log("configId",configId);
  

  const handleEdit = () => {
    // Push to the config form for editing
    router.push('/dashboard/config');
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/config/${configId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete configuration');
      }

      // Optionally, refresh the page or remove the config from the table
      router.refresh();
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        className="text-blue-500"
        onClick={handleEdit}
      >
        <Edit className="w-4 h-4" /> Edit
      </Button>
      <Button
        className="text-red-500"
        onClick={handleDelete}
      >
        <Delete className="w-4 h-4" /> Delete
      </Button>
    </div>
  );
};

export default ActionButtons;
