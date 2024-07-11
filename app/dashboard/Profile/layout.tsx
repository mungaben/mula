import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
};

export default ProfileLayout;
