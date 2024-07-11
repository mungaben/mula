"use client";

import React, { useState } from 'react';

import ReferralModal from '@/app/components/ReferralModal';
import UserProfile from '@/app/components/UserProfile';

const user = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
  balance: 100.0,
  totalDeposits: 200.0,
  totalEarnings: 150.0,
  totalWithdrawals: 50.0,
  commissionsEarned: 20.0,
  interest: 10.0,
  referrals: [
    { id: 1, name: 'Jane Smith', email: 'jane.smith@example.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob.johnson@example.com' }
  ]
};

const HomePage: React.FC = () => {
  const [isReferralModalOpen, setReferralModalOpen] = useState(false);

  const handleViewReferrals = () => {
    setReferralModalOpen(true);
  };

  const handleCloseReferralModal = () => {
    setReferralModalOpen(false);
  };

  return (
    <>
      <UserProfile user={user} onViewReferrals={handleViewReferrals} />
      {isReferralModalOpen && <ReferralModal referrals={user.referrals} onClose={handleCloseReferralModal} />}
    </>
  );
};

export default HomePage;
