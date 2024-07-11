import React from 'react';

interface Referral {
  id: number;
  name: string;
  email: string;
}

interface ReferralModalProps {
  referrals: Referral[];
  onClose: () => void;
}

const ReferralModal: React.FC<ReferralModalProps> = ({ referrals, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Referrals</h2>
        <ul>
          {referrals.map((referral) => (
            <li key={referral.id} className="mb-2">
              <div><strong>Name:</strong> {referral.name}</div>
              <div><strong>Email:</strong> {referral.email}</div>
            </li>
          ))}
        </ul>
        <button onClick={onClose} className="bg-red-600 px-4 py-2 rounded mt-4">Close</button>
      </div>
    </div>
  );
};

export default ReferralModal;
