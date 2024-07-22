"use client";

import { Copy } from "lucide-react";
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
import useModuleStore from "@/lib/storage/modules";
import toast from "react-hot-toast";
import { useState } from "react";
import { getSession } from "next-auth/react";
import { toast as tot } from '@/components/ui/use-toast';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

interface RequestWithdrawProps {
  user?: User;
}

export function RequestWithdraw({ user }: RequestWithdrawProps) {
  const { withdrawModule, toggleWithdrawModule } = useModuleStore();

  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const session = await getSession();

    if (!session?.user) {
      tot({
        title: "Not authenticated",
        description: "Please log in.",
        action: (
          <Button onClick={() => window.location.href = '/auth/signin'}>Sign In</Button>
        ),
      });
      return;
    }

    if (!amount) {
      setError('Please enter an amount.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/withdrawal/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          simPhoneNumberId: phoneNumber || user?.phone || '',
          amount: parsedAmount,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Withdrawal request submitted successfully!');
        tot({
          title: 'Success',
          description: 'Withdrawal request submitted successfully!',
        });
        setPhoneNumber('');
        setAmount('');
        toggleWithdrawModule();
      } else {
        setError(result.error || 'Failed to submit withdrawal request.');
        tot({
          title: 'Error',
          description: result.error || 'Failed to submit withdrawal request.',
        });
      }
    } catch (err) {
      setError('An error occurred while submitting the withdrawal request.');
      tot({
        title: 'Error',
        description: 'An error occurred while submitting the withdrawal request.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={withdrawModule} onOpenChange={toggleWithdrawModule}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Enter the amount to withdraw. Phone number is optional.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
                disabled={loading}
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={loading}
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
