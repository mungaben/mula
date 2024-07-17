// app/auth/signin/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/dashboad/Profile'); // Redirect to dashboard after successful login
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <h1 className="text-2xl font-bold">Sign In</h1>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4"
              required
            />
          </CardContent>
          <CardFooter className=' w-full flex justify-between' >
            <Button type="submit" size="lg">
              Sign In
            </Button>
            <span>
              or
            </span>
            <Button asChild variant={"link"}>
  <Link href="/auth/signup">create account</Link>
</Button>

          </CardFooter>
        </form>
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </Card>
    </div>
  );
}
