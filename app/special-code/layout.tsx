import { ReactNode } from 'react';
import AdminLayout from '../(Admin)/layout';

const SpecialCodeLayout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default SpecialCodeLayout;
