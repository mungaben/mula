import React from 'react';

const Portfolio: React.FC = () => {
  return (
    <div className="p-4 bg-white rounded-xl shadow-md my-4">
      <div className="text-lg font-semibold">Portfolio</div>
      <div className="w-full h-4 bg-gray-300 rounded-full my-2">
        <div className="h-full bg-blue-500 rounded-full" style={{ width: '50%' }}></div>
      </div>
      <div className="text-sm text-gray-600">$6543 (Last Month)</div>
    </div>
  );
};

export default Portfolio;
