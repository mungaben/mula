"use client"

import { z } from 'zod';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";
import useModuleStore from "@/lib/storage/modules";
import { getSession } from "next-auth/react";
import { toast as tot } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name?: string;
}

interface RedeemCodeProps {
  user?: User;
}

export const specialCodeSchema = z.object({
  totalAmount: z.number().positive(), // Total redeemable amount
  redeemAmount: z.number().positive(), // Amount each user gets
  expiresAt: z.date(),
  userId: z.string().optional(),
});

export function RedeemCode({ user }: RedeemCodeProps) {
  const { redeemCodeModule, toggleRedeemCodeModule } = useModuleStore();
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = await getSession();
    
    if (!code) {
      setError('Please enter a code.');
      return;
    }
    if (!session?.user) {
      tot({
        title: "Not authenticated",
        description: "Please log in."
      });
      return;
    }

    setError(null);
    setLoading(true); // Set loading state to true

    try {
      const response = await fetch('/api/special-code/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, userId: session.user.id }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Code redeemed successfully!');
        tot({
          title: 'Redeemed code success',
          description: 'Balance updated.'
        });
        setCode('');
        toggleRedeemCodeModule();
      } else {
        setError(result.error || 'Failed to redeem code.');
        tot({
          title: 'Redeem error',
          description: result.error || 'Failed to redeem code.',
        });
      }
    } catch (err) {
      setError('An error occurred while redeeming the code.');
      toast.error('An error occurred while redeeming the code.');
    } finally {
      setLoading(false); // Set loading state to false
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-black dark:text-stone-200">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter special code"
                disabled={loading} // Disable input while loading
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="submit" variant={"default"} disabled={loading}>
              {loading ? 'Loading...' : 'Submit'} 
            </Button>
            <DialogClose asChild>
              <Button type="button" variant={"ghost"} disabled={loading}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
