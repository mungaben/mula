import { Metadata } from "next";
import Breadcrumb from "../components/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "../components/components/Layouts/DefaultLaout";
import TableOne from "../components/components/Tables/TableOne";
import TableThree from "../components/components/Tables/TableThree";
import TableTwo from "../components/components/Tables/TableTwo";


export const metadata: Metadata = {
  title: "Next.js Tables Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Tables page for NextAdmin Dashboard Kit",
};

const TablesPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
