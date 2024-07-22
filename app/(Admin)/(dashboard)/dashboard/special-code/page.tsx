"use client";

import React from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { columns } from '@/app/special-code/column';
import { SpecialCodeClient } from '@/app/special-code/ModelClientS';


const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Special Codes', link: '/dashboard/special-code' }
];

export default function SpecialCodePage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />
      <SpecialCodeClient
        apiEndpoint="/api/special-code/create/?all=true"
        model="specialcode"
        columns={columns}
        headingTitle="Special Codes"
        headingDescription="Manage special codes (Client side table functionalities.)"
        newEntityUrl="/dashboard/specialcode/new"
      />
    </div>
  );
}
