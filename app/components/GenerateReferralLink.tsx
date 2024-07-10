"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';

type GenerateReferralFormData = {
  userId: string;
  level1Percentage: number;
  level2Percentage: number;
  level3Percentage: number;
  linkLifetime: number; // in days
};

export function GenerateReferralLink() {
  const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<GenerateReferralFormData>();

  const onSubmit = async (data: GenerateReferralFormData) => {
    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Referral link generated: ${result.referralLink}`);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('Error generating referral link.');
    }
  };

  return (
    <div>
      <h1>Generate Referral Link</h1>
      {message && <Alert>{message}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label>User ID</Label>
          <Input {...register('userId')} required />
        </div>
        <div>
          <Label>Level 1 Percentage</Label>
          <Input type="number" {...register('level1Percentage', { valueAsNumber: true })} required />
        </div>
        <div>
          <Label>Level 2 Percentage</Label>
          <Input type="number" {...register('level2Percentage', { valueAsNumber: true })} required />
        </div>
        <div>
          <Label>Level 3 Percentage</Label>
          <Input type="number" {...register('level3Percentage', { valueAsNumber: true })} required />
        </div>
        <div>
          <Label>Link Lifetime (days)</Label>
          <Input type="number" {...register('linkLifetime', { valueAsNumber: true })} required />
        </div>
        <Button type="submit">Generate Link</Button>
      </form>
    </div>
  );
}
