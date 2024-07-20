import Breadcrumb from "@/app/components/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/app/components/components/Layouts/DefaultLaout";
import SettingBoxes from "@/app/components/components/SettingBoxes";

import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Next.js Settings Page | NextAdmin - Next.js Dashboard c",
  description: "This is Next.js Settings page for NextAdmin Dashboard Kit",
};

const Settings = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[1080px]">
        <Breadcrumb pageName="Settings" />

        <SettingBoxes />
      </div>
    </DefaultLayout>
  );
};

export default Settings;
