"use client"

// components/RegisterForm.tsx
import { useForm } from 'react-hook-form';

import axios from 'axios';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useRouter } from 'next/navigation';


type RegisterFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export default function RegisterForm() {
  const { register, handleSubmit } = useForm<RegisterFormData>();
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await axios.post('/api/auth/register', data);
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="name">Name</label>
        <Input id="name" {...register('name')} />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" {...register('email')} />
      </div>
      <div>
        <label htmlFor="phone">Phone</label>
        <Input id="phone" type="text" {...register('phone')} />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" {...register('password')} />
      </div>
      <Button type="submit">Register</Button>
    </form>
  );
}
