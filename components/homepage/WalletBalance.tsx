import React from 'react';

const WalletBalance: React.FC = () => {
  return (
    <div className="p-4 bg-gray-100 rounded-xl shadow-md my-4">
      <div className="text-2xl font-bold">9835.73 ETH</div>
      <div className="text-green-500">+2.28% Past 24 Hours</div>
      <div className="flex space-x-4 mt-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Send</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Receive</button>
      </div>
    </div>
  );
};

export default WalletBalance;
