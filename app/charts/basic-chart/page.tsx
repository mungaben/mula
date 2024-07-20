import Breadcrumb from "@/app/components/components/Breadcrumbs/Breadcrumb";
import BasicChart from "@/app/components/components/Charts/BasicChart";
import DefaultLayout from "@/app/components/components/Layouts/DefaultLaout";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Next.js Basic Chart Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Basic Chart page for NextAdmin Dashboard Kit",
  // other metadata
};

const BasicChartPage: React.FC = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Basic Chart" />

      <BasicChart />
    </DefaultLayout>
  );
};

export default BasicChartPage;
