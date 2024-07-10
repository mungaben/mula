import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { fetchPhoneNumbers, requestWithdrawal } from '@/lib/api';

type WithdrawalRequestFormData = {
  userId: string;
  simPhoneNumberId: string;
  amount: number;
};

const WithdrawalRequestForm: React.FC<{ userId: string }> = ({ userId }) => {
  const [phoneNumbers, setPhoneNumbers] = useState<{ id: string; phoneNumber: string }[]>([]);
  const [message, setMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm<WithdrawalRequestFormData>();

  useEffect(() => {
    async function loadPhoneNumbers() {
      const phoneNumbers = await fetchPhoneNumbers();
      setPhoneNumbers(phoneNumbers);
    }

    loadPhoneNumbers();
  }, []);

  const onSubmit = async (data: WithdrawalRequestFormData) => {
    data.userId = userId;
    const response = await requestWithdrawal(data);
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage('Withdrawal request submitted successfully');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Request Withdrawal</h1>
      {message && <Alert>{message}</Alert>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label>Select Phone Number</Label>
          <select
            {...register('simPhoneNumberId')}
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
            required
          >
            {phoneNumbers.map((number) => (
              <option key={number.id} value={number.id}>
                {number.phoneNumber}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <Label>Withdrawal Amount</Label>
          <Input
            type="number"
            {...register('amount', { valueAsNumber: true, min: 0 })}
            placeholder="Enter amount to withdraw"
            required
          />
          {errors.amount && <p className="text-red-600">{errors.amount.message}</p>}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default WithdrawalRequestForm;
