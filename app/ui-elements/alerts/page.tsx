import AlertError from "@/app/components/components/Alerts/AlertError";
import AlertSuccess from "@/app/components/components/Alerts/AlertSuccess";
import AlertWarning from "@/app/components/components/Alerts/AlertWarning";
import Breadcrumb from "@/app/components/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/app/components/components/Layouts/DefaultLaout";



const Alerts = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Alerts" />

      <div className="rounded-[10px] bg-white p-4 shadow-1 dark:bg-gray-dark dark:shadow-card md:p-6 xl:p-9">
        <div className="flex flex-col gap-7.5">
          <AlertWarning />
          <AlertSuccess />
          <AlertError />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Alerts;
