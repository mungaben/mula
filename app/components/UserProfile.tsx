import React from 'react';

interface User {
  name: string;
  email: string;
  phone?: string;
  balance: number;
  totalDeposits: number;
  totalEarnings: number;
  totalWithdrawals: number;
  commissionsEarned: number;
  interest: number;
  referrals: {
    id: number;
    name: string;
    email: string;
  }[];
}

interface UserProfileProps {
  user: User;
  onViewReferrals: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onViewReferrals }) => {
  return (
    <div className="space-y-4">
      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">User Profile</h2>
        <div className="mb-2"><strong>Name:</strong> {user.name}</div>
        <div className="mb-2"><strong>Email:</strong> {user.email}</div>
        <div className="mb-2"><strong>Phone:</strong> {user.phone}</div>
        <div className="mb-2"><strong>Balance:</strong> ${user.balance.toFixed(2)}</div>
      </div>

      <div className="bg-gray-800 p-4 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Additional Details</h2>
        <div className="mb-2"><strong>Total Deposits:</strong> ${user.totalDeposits.toFixed(2)}</div>
        <div className="mb-2"><strong>Total Earnings:</strong> ${user.totalEarnings.toFixed(2)}</div>
        <div className="mb-2"><strong>Total Withdrawals:</strong> ${user.totalWithdrawals.toFixed(2)}</div>
        <div className="mb-2"><strong>Commissions Earned:</strong> ${user.commissionsEarned.toFixed(2)}</div>
        <div className="mb-2"><strong>Interest:</strong> ${user.interest.toFixed(2)}</div>
        <div className="mt-4 flex space-x-2">
          <button className="bg-blue-600 px-4 py-2 rounded">Sign Out</button>
          <button className="bg-green-600 px-4 py-2 rounded">Redeem Gift</button>
          <button className="bg-purple-600 px-4 py-2 rounded" onClick={onViewReferrals}>View Referrals</button>
          <button className="bg-yellow-600 px-4 py-2 rounded">Deposit</button>
          <button className="bg-red-600 px-4 py-2 rounded">Request Withdrawal</button>
          <button className="bg-teal-600 px-4 py-2 rounded">Copy Referral Link</button>
          <button className="bg-pink-600 px-4 py-2 rounded">Promotion Request</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
