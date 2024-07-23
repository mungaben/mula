import { Breadcrumbs } from '@/components/breadcrumbs';
import { columns } from '@/components/tables/config-tables/columns';
import { UserClient } from '@/components/tables/user-tables/client';
import { ModelClient } from '@/components/tables/user-tables/ModelClient';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'config', link: '/dashboard/config' }
];

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <ModelClient
      apiEndpoint="/api/config"
      model="config"
      columns={columns}
      headingTitle="Config"
      headingDescription="Manage config (Client side table functionalities.)"
      newEntityUrl="/dashboard/config/new"
    />
      
      
    </div>
  );
}
