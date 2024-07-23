"use client"

import React from 'react'
import useFetch from '@/lib/useFetch'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { parsePhoneNumber } from 'libphonenumber-js'
import currency from 'currency.js'
import { faker } from '@faker-js/faker'

interface User {
  phone?: string;
}

interface WithdrawalRequest {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: User;
}



faker.seed(254);

const generateRandomPhoneNumber = (): string => {
  const randomDigits = faker.phone.number('##########');
  const firstPart = randomDigits.substring(0, 3);
  const secondPart = '***';
  const thirdPart = randomDigits.substring(6);
  return `+${firstPart}${secondPart}${thirdPart}`;
};

const formatAmountWithCurrency = (phoneNumber: string | undefined, amount: number): string => {
  if (!phoneNumber) return amount.toString();
  try {
    const parsedNumber = parsePhoneNumber(phoneNumber);
    if (parsedNumber && parsedNumber.country === 'KE') {
      return currency(amount, { symbol: 'KSH ' }).format();
    }
    return currency(amount).format();
  } catch (error) {
    console.error('Error parsing phone number:', error);
    return amount.toString();
  }
};

const generateRandomAmount = (): number => {
  return parseFloat(faker.finance.amount(100, 10000, 0));
};

const Withdrawals = () => {
  const { data, error, isLoading } = useFetch<WithdrawalRequest[]>('api/withdrawal/userdata')
    
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;


  console.log("data available user with phone",data);
  

  return (
    <div className="flex flex-col gap-4">
      {data?.map((withdrawal) => (
        <Card key={withdrawal.id} className='max-w-screen-sm bg-red-200 flex flex-col'>
          <CardHeader className="flex flex-row gap-5">
            <CardTitle>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </CardTitle>
            <CardDescription className='flex flex-col'>
              <span>Phone: {withdrawal.user.phone || generateRandomPhoneNumber()}</span>
              {/* <span>Amount: {formatAmountWithCurrency(withdrawal.user.phoneNumber, withdrawal.amount || generateRandomAmount())}</span> */}
           <span> {withdrawal.user.phone}</span>
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}

export default Withdrawals
