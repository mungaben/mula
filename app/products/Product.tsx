import { Breadcrumbs } from '@/components/breadcrumbs';



import { UserClient } from '@/components/tables/user-tables/client';
import { columns } from './columns';
import { ModelClient } from './ModelClientU';



const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'withdraw', link: '/dashboard/product' }
];


// http://localhost:3000/dashboard/withraw
// app\api\withdrawal\request\route.ts
// const { data, error, isLoading } = useFetch<prodx[]>('api/products/userProducts')

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8 w-full ">
      {/* <Breadcrumbs items={breadcrumbItems} /> */}
      <ModelClient
        apiEndpoint="/api/products/userProducts"
        model="product"
        columns={columns}
        headingTitle=""
        headingDescription="Buy coins that has best returns "
        newEntityUrl="/dashboard/product/new"
      />


    </div>
  );
}
