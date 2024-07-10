"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import SpecialCodeLayout from './layout';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';

const specialCodeSchema = z.object({
  totalAmount: z
    .number()
    .positive('Total amount must be a positive number.')
    .min(0.01, 'Total amount must be greater than zero.'),
  redeemAmount: z
    .number()
    .positive('Redeem amount must be a positive number.')
    .min(0.01, 'Redeem amount must be greater than zero.'),
  expiresAt: z
    .preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof String) {
        const date = new Date(arg as string);
        console.log("date", date);
        return isNaN(date.getTime()) ? null : date;
      }
      console.log("xxx", arg, typeof(arg));
      return arg;
    }, z.date().nullable().refine((val) => val === null || val > new Date(), {
      message: 'Expiration date must be a future date.',
    })),
}).superRefine((data, ctx) => {
  if (data.redeemAmount >= data.totalAmount) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Redeem amount must be less than the total amount.',
      path: ['redeemAmount'],
    });
  }
});

type SpecialCodeFormData = z.infer<typeof specialCodeSchema>;

export function CreateSpecialCodePage() {
  const [message, setMessage] = useState('');

  const form = useForm<SpecialCodeFormData>({
    resolver: zodResolver(specialCodeSchema),
    defaultValues: {
      totalAmount: 0,
      redeemAmount: 0,
      expiresAt: null,
    },
  });

  async function onSubmit(values: SpecialCodeFormData) {
    // Ensure expiresAt is transformed to an ISO string
    const transformedValues = {
      ...values,
      expiresAt: values.expiresAt ? values.expiresAt.toISOString() : null
    };

    try {
      const response = await fetch('/api/special-code/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedValues),
      });

      if (response.ok) {
        setMessage('Special code created successfully.');
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error creating special code:', error);
      setMessage('Error creating special code.');
    }
  }

  return (
    <SpecialCodeLayout>
      <h1>Create Special Code</h1>
      {message && <Alert>{message}</Alert>}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Label>Total Amount</Label>
          <Input
            type="number"
            {...form.register('totalAmount', { valueAsNumber: true })}
            placeholder="Enter total amount"
            required
          />
          {form.formState.errors.totalAmount && <p>{form.formState.errors.totalAmount.message}</p>}
        </div>
        <div className="mb-3">
          <Label>Redeem Amount</Label>
          <Input
            type="number"
            {...form.register('redeemAmount', { valueAsNumber: true })}
            placeholder="Enter redeem amount"
            required
          />
          {form.formState.errors.redeemAmount && <p>{form.formState.errors.redeemAmount.message}</p>}
        </div>
        <div className="mb-3">
          <Label>Expiration Date</Label>
          <Input
            type="datetime-local"
            {...form.register('expiresAt', {
              setValueAs: (value) => value === '' ? null : new Date(value),
            })}
            required
          />
          {form.formState.errors.expiresAt && <p>{form.formState.errors.expiresAt.message}</p>}
        </div>
        <Button type="submit">Create Special Code</Button>
      </form>
    </SpecialCodeLayout>
  );
}

export default CreateSpecialCodePage;
