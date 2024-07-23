import { Breadcrumbs } from '@/components/breadcrumbs';

import { UserClient } from '@/components/tables/user-tables/client';

import { columns } from '@/components/tables/withdraw/columns';
import { ModelClient } from '@/components/tables/withdraw/ModelClientw';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'withdraw', link: '/dashboard/withdraw' }
];


// http://localhost:3000/dashboard/withraw
// app\api\withdrawal\request\route.ts

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <ModelClient
      apiEndpoint="/api/withdrawal/request"
      model="withdrawals"
      columns={columns}
      headingTitle="withdrawals"
      headingDescription="Manage withdrawals (Client side table functionalities.)"
      newEntityUrl="/dashboard/withdraw/new"
    />
      
      
    </div>
  );
}
