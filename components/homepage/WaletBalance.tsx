import React from 'react';

const WalletList: React.FC = () => {
  const wallets = [
    { name: 'Etherium', balance: '9835.73', change: '+2.28%' },
    { name: 'Bitcoin', balance: '7634.43', change: '+0.28%' },
    { name: 'Chain Link', balance: '743.49', change: '-2.28%' },
  ];

  return (
    <div className="p-4 bg-white rounded-xl shadow-md my-4">
      <div className="text-lg font-semibold">My Wallets</div>
      {wallets.map((wallet, index) => (
        <div key={index} className="flex justify-between items-center my-2">
          <div className="flex items-center">
            <div className="bg-gray-200 p-2 rounded-full mr-4"></div>
            <div>{wallet.name}</div>
          </div>
          <div>{wallet.balance}</div>
          <div className={wallet.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
            {wallet.change}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalletList;
