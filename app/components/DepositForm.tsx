import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { fetchPhoneNumbers, initiateDeposit } from '@/lib/api';


type DepositFormData = {
  userId: string;
  simPhoneNumberId: string;
  amount: number;
};

const DepositForm: React.FC<{ userId: string; productPrice: number }> = ({ userId, productPrice }) => {
  const [phoneNumbers, setPhoneNumbers] = useState<{ id: string, phoneNumber: string }[]>([]);
  const [message, setMessage] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm<DepositFormData>();

  useEffect(() => {
    async function loadPhoneNumbers() {
      const phoneNumbers = await fetchPhoneNumbers();
      setPhoneNumbers(phoneNumbers);
    }

    loadPhoneNumbers();
  }, []);

  const onSubmit = async (data: DepositFormData) => {
    const response = await initiateDeposit(data);
    if (response.error) {
      setMessage(response.error);
    } else {
      setMessage(response.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deposit Form</h1>
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
          <Label>Deposit Amount</Label>
          <Input
            type="number"
            {...register('amount', { valueAsNumber: true, min: productPrice })}
            placeholder={`Minimum amount: ${productPrice}`}
            required
          />
          {errors.amount && <p className="text-red-600">{errors.amount.message}</p>}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default DepositForm;
