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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber && !user?.phone) {
      setError('Please enter a phone number.');
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

    if (user?.id) {
      try {
       
        const response = await fetch('/api/withdrawal/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user.id,
            simPhoneNumberId: phoneNumber || user?.phone || '', // Ensure it's a string
            amount: parsedAmount,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success('Withdrawal request submitted successfully!');
          setPhoneNumber('');
          setAmount('');
          toggleWithdrawModule();
        } else {
          toast.error(result.error || 'Failed to submit withdrawal request.');
        }
      } catch (err) {
        toast.error('An error occurred while submitting the request.');
      }
    } else {
      toast.error('User not authenticated.');
    }
  };

  return (
    <Dialog open={withdrawModule} onOpenChange={toggleWithdrawModule}>
     
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
          <DialogDescription>
            Enter your phone number and the amount to withdraw.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={phoneNumber || user?.phone || ''}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
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
