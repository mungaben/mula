"use client"

import { z } from 'zod';

export const specialCodeSchema = z.object({
  totalAmount: z.number().positive(), // Total redeemable amount
  redeemAmount: z.number().positive(), // Amount each user gets
  expiresAt: z.date(),
  userId: z.string().optional(),
});

// export const redeemCodeSchema = z.object({
//   code: z.string(),
//   userId: z.string(),
// });

// components/RedeemCode.tsx


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import { redeemCodeSchema } from "@/lib/schemas";
import useModuleStore from "@/lib/storage/modules";
import { getSession, useSession } from "next-auth/react";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface RedeemCodeProps {
  user?: User;
}

export function RedeemCode({ user }: RedeemCodeProps) {
  const { redeemCodeModule, toggleRedeemCodeModule } = useModuleStore();
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {

    const session=await getSession()

    e.preventDefault();
    if (!code) {
      setError('Please enter a code.');
      return;
    }
    if (!session?.user) {
      toast.error('User not authenticated.');
      return;
    }

    setError(null);

    try {
      const response = await fetch('/api/special-code/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, userId:session.user.id }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Code redeemed successfully!');
        setCode('');
        toggleRedeemCodeModule();
      } else {
        setError(result.error || 'Failed to redeem code.');
      }
    } catch (err) {
      toast.error('An error occurred while redeeming the code.');
    }
  };

  return (
    <Dialog open={redeemCodeModule} onOpenChange={toggleRedeemCodeModule}>
   
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Redeem Special Code</DialogTitle>
          <DialogDescription>
            Enter your special code to redeem.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter special code"
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="submit" variant={"default"}>
              Submit
            </Button>
            <DialogClose asChild>
              <Button type="button" variant={"ghost"}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
