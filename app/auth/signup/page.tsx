'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

const signUpSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }),
  phone: z.string().regex(/^\d{10,15}$/, { message: 'Phone number must be between 10 and 15 digits' }),
  usedReferralLink: z.string().optional(),
});

type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string | null>(null); // For holding the generated referral link
  const searchParams = useSearchParams();
  const router = useRouter();

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  useEffect(() => {
    const referral = searchParams.get('referral');
    if (referral) {
      setValue('usedReferralLink', referral);
    }
  }, [searchParams, setValue]);

  const onSubmit: SubmitHandler<SignUpFormData> = async (data) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setReferralLink(result.referralLink); // Set the referral link on successful signup
        toast.success('Signup successful!');
        router.push('/auth/signin');
      } else {
        if (response.status === 409) {
          // User already exists, redirect to sign-in page
          toast.error('User already exists. Redirecting to sign-in page...');
          setTimeout(() => {
            router.push('/auth/signin');
          }, 2000);
        } else {
          setError(result.error || 'Failed to sign up');
        }
      }
    } catch (error) {
      setError('An unknown error occurred');
    }
  };

  const handleCopyLink = () => {
    if (referralLink) {
      const fullReferralLink = `${window.location.origin}/auth/signup?referral=${referralLink}`;
      navigator.clipboard.writeText(fullReferralLink);
      toast.success("Referral link copied to clipboard!");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <h1 className="text-2xl font-bold">Sign Up</h1>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent>
            <Input
              type="text"
              placeholder="Name"
              {...register('name')}
              className="mb-4"
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
            <Input
              type="email"
              placeholder="Email"
              {...register('email')}
              className="mb-4"
              required
            />
            {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            <Input
              type="password"
              placeholder="Password"
              {...register('password')}
              className="mb-4"
              required
            />
            {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            <Input
              type="text"
              placeholder="Phone Number"
              {...register('phone')}
              className="mb-4"
              required
            />
            {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
            <Input
              type="text"
              placeholder="Referral Link (optional)"
              {...register('usedReferralLink')}
              className="mb-4"
              
            />
            {errors.usedReferralLink && <span className="text-red-500">{errors.usedReferralLink.message}</span>}
          </CardContent>
          <CardFooter>
            <Button type="submit" size="lg">
              Sign Up
            </Button>
          </CardFooter>
        </form>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        {referralLink && (
          <div className="mt-4">
            <p>Your referral link:</p>
            <div className="flex items-center">
              <Input readOnly value={`${window.location.origin}/auth/signup?referral=${referralLink}`} className="mr-2" />
              <Button onClick={handleCopyLink}>Copy Link</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
