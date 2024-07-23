"use client";

import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import useModuleStore from "@/lib/storage/modules";
import { getSession } from "next-auth/react";
import { Input } from "@/components/ui/input";


interface User {
  id: string;
  email: string;
  name?: string;
}

interface ReferralLinkProps {
  user?: User;
}

interface Referee {
  name: string;
  email: string;
}

export function ReferralLinkModal({ user }: ReferralLinkProps) {
  const { referralLinkModule, toggleReferralLinkModule } = useModuleStore();
  const [referralLink, setReferralLink] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [referees, setReferees] = useState<Referee[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetchReferees();
    }
  }, [user]);

  const fetchReferees = async () => {
    try {
      const response = await fetch(`/api/referral?userId=${user?.id}`);
      const result = await response.json();
      if (response.ok) {
        setReferees(result.referees);
      } else {
        toast.error(result.error || "Failed to fetch referees.");
      }
    } catch (err) {
      toast.error("An error occurred while fetching referees.");
    }
  };

  const handleGenerateLink = async () => {

    const session =await getSession()

    if (!session?.user) {
      toast.error("User not authenticated.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/referral", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: session.user.id }),
      });

      const result = await response.json();

      if (response.ok) {
        setReferralLink(result.referralLink);
        toast.success("Referral link generated successfully!");
      } else {
        toast.error(result.error || "Failed to generate referral link.");
      }
    } catch (err) {
      toast.error("An error occurred while generating the referral link.");
    } finally {
      setLoading(false);
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
    <Dialog open={referralLinkModule} onOpenChange={toggleReferralLinkModule}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Referral Link</DialogTitle>
          <DialogDescription>
            Generate and copy your referral link.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {referralLink ? (
            <div>
              <Label htmlFor="referralLink">Your Referral Link</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="referralLink"
                  type="text"
                  value={`${window.location.origin}/auth/signup?referral=${referralLink}`}
                  readOnly
                  className="input"
                />
                <Button type="button" onClick={handleCopyLink}>
                  Copy
                </Button>
              </div>
            </div>
          ) : (
            <Button onClick={handleGenerateLink} disabled={loading}>
              {loading ? "Generating..." : "Generate Referral Link"}
            </Button>
          )}
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">People who used your referral link</h3>
          {referees.length > 0 ? (
            <ul className="list-disc ml-5">
              {referees.map((referee, index) => (
                <li key={index}>
                  {referee.name} ({referee.email})
                </li>
              ))}
            </ul>
          ) : (
            <p>No one has used your referral link yet.</p>
          )}
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant={"ghost"}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
