"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

type Referral = {
  id: string;
  referrer: {
    name: string;
  };
  referee?: {
    name: string;
  };
  level: number;
  percentage: number;
  linkLifetime: string;
};

export function ViewReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [message, setMessage] = useState('');

  const fetchReferrals = async () => {
    try {
      const response = await fetch('/api/referral?userId=<USER_ID>'); // Replace <USER_ID> with actual user ID
      const result = await response.json();

      if (response.ok) {
        setReferrals(result.referrals);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('Error fetching referrals.');
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  return (
    <div>
      <h1>View Referrals</h1>
      {message && <Alert>{message}</Alert>}
      <ul>
        {referrals.map((referral) => (
          <li key={referral.id}>
            Referrer: {referral.referrer.name}, Referee: {referral.referee?.name || 'N/A'}, Level: {referral.level}, Percentage: {referral.percentage}, Link Lifetime: {new Date(referral.linkLifetime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
