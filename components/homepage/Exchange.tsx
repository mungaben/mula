import React from 'react';

const Exchange: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md my-4">
      <div className="text-lg font-semibold">Exchange</div>
      <div className="my-2">
        <div className="flex flex-col sm:flex-row justify-between items-center my-2">
          <div>You Pay</div>
          <div>Bitcoin</div>
          <div>6590.08 BTC</div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center my-2">
          <div>You Get</div>
          <div>US Dollar</div>
          <div>75356.09 USD</div>
        </div>
        <div className="my-2">Gas Fee: $2.3 Per Dollar</div>
      </div>
      <div className="my-2">
        <div className="flex flex-col sm:flex-row justify-between items-center my-2">
          <div>Exchange Account</div>
          <div>Mollet</div>
          <div>6342.08 USD</div>
        </div>
        <div className="w-full h-4 bg-gray-300 rounded-full my-2">
          <div className="h-full bg-yellow-500 rounded-full" style={{ width: '75%' }}></div>
        </div>
        <div className="text-sm text-gray-600">Wallet Token</div>
        <input className="w-full p-2 border border-gray-300 rounded-md" value="FNDzzKUoqTJaHIDxc63NeHABCD42" readOnly />
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded-md mt-4">Swipe to Exchange</button>
    </div>
  );
};

export default Exchange;
