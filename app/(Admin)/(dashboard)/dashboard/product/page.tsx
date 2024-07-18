import { Breadcrumbs } from '@/components/breadcrumbs';
import { columns } from '@/app/product/column';
import { ModelClient } from '@/app/product/ModelClientp';

import { UserClient } from '@/components/tables/user-tables/client';



const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'withdraw', link: '/dashboard/product' }
];


// http://localhost:3000/dashboard/withraw
// app\api\withdrawal\request\route.ts

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <ModelClient
      apiEndpoint="/api/products"
      model="product"
      columns={columns}
      headingTitle="product"
      headingDescription="Manage withdrawals (Client side table functionalities.)"
      newEntityUrl="/dashboard/product/new"
    />
      
      
    </div>
  );
}
