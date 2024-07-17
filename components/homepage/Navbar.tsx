
"use client"

import React, { useState } from 'react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <img src="/path/to/logo.png" alt="Logo" className="h-8" />
        <div className="hidden md:flex space-x-4">
          <a href="#" className="hover:text-teal-500">TRADE</a>
          <a href="#" className="hover:text-teal-500">EARN</a>
          <a href="#" className="hover:text-teal-500">XCETUS</a>
          <a href="#" className="hover:text-teal-500">LAUNCHPAD</a>
          <a href="#" className="hover:text-teal-500">MORE</a>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded-full">
          <img src="/path/to/aptos-logo.png" alt="Aptos Logo" className="h-4" />
          <span>Aptos</span>
        </button>
        <button className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition">
          CONNECT WALLET
        </button>
      </div>
      <div className="md:hidden">
        <button onClick={toggleMenu} className="text-2xl">&#9776;</button>
      </div>
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col items-center space-y-4 py-4 md:hidden">
          <a href="#" className="hover:text-teal-500">TRADE</a>
          <a href="#" className="hover:text-teal-500">EARN</a>
          <a href="#" className="hover:text-teal-500">XCETUS</a>
          <a href="#" className="hover:text-teal-500">LAUNCHPAD</a>
          <a href="#" className="hover:text-teal-500">MORE</a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
