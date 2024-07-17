import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <button className="text-2xl">&#9776;</button>
      <div className="text-lg font-semibold">Current Wallet Balance</div>
      <button className="text-2xl">&#128276;</button>
    </header>
  );
};

export default Header;
