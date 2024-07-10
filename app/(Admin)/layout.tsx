import { ReactNode } from 'react';
import Link from 'next/link';
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/components/ui/navigation-menu';


const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Admin Panel</NavigationMenuTrigger>
            <NavigationMenuContent>
              <NavigationMenuLink  href="/admin">Dashboard</NavigationMenuLink>
              <NavigationMenuLink  href="/admin/special-code/create">Create Special Code</NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
};

export default AdminLayout;
