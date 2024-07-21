
import { Metadata } from "next";
import DefaultLayout from "../components/components/Layouts/DefaultLaout";
import ProfileBox from "../components/components/ProfileBox";
import Breadcrumb from "../components/components/Breadcrumbs/Breadcrumb";


export const metadata: Metadata = {
  title: "Next.js Profile Page | TikEarn - Next.js Dashboard Kit",
  description: "This is Next.js Profile page for TikEarn Dashboard Kit",
};

const Profile = () => {
  return (
    <DefaultLayout>
      <div className="mx-auto w-full max-w-[970px]">
        <Breadcrumb pageName="Profile" />

        <ProfileBox />
      </div>
    </DefaultLayout>
  );
};

export default Profile;
