"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useModuleStore from "@/lib/storage/modules";
import Link from 'next/link';
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/app/components/LoadingSpinner";

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

interface ProfileProps {
  user?: User;
}

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { depositModule, toggleDepositModule, toggleWithdrawModule, toggleRedeemCodeModule, toggleReferralLinkModule } = useModuleStore();

  const router = useRouter();

  useEffect(() => {
    console.log("things started");
    
    if (user?.id) {
      fetchProfile(user.id);
    }
  }, [user]);

  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/Users/${userId}`);

    
      
      const result = await response.json();
      console.log("response",response);

      if (response.ok) {
        setProfile(result);
      } else {
        console.error(result.error || "Failed to fetch profile data.");
      }
    } catch (err) {
      console.error("An error occurred while fetching the profile data.", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner/>;
  }

  if (!profile) {
    return <div>No profile data found.</div>;
  }

  const tableConst = [
    {
      name: "Deposit",
      action: toggleDepositModule,
    },
    {
      name: "Withdraw",
      action: toggleWithdrawModule,
    },
    {
      name: "RedeemCode",
      action: toggleRedeemCodeModule,
    },
    {
      name: "BecomeAdmin",
      link: "your_become_admin_link_here",
    },
    {
      name: "InviteFriend",
      action: toggleReferralLinkModule,
    },
  ];

  return (
    <Card className="w-full h-full rounded-lg border bg-white shadow-md transition duration-700 ease-out hover:ease-in ">
      <CardHeader>
        <CardTitle className="text-gray-800">{profile.phone}</CardTitle>
        <CardDescription className="text-gray-600">{profile.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col text-gray-800 font-bold gap-5">
          <div className="flex flex-col">
            <span className="capitalize text-xl lg:text-5xl md:text-3xl sm:text-2xl font-extrabold gap-2">
              Balance
            </span>
            <span className="capitalize text-xl lg:text-3xl md:text-3xl sm:text-xl font-medium">
              <span className="text-4xl font-extrabold text-black dark:text-white relative">
                <span className="text-transparent text-3xl gap-2 bg-clip-text bg-gradient-to-br from-gray-800 to-gray-500">
                  Ksh
                </span>
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-black to-gray-800 drop-shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
                  {profile.balance|| "000.00"}
                </span>
                <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-transparent opacity-10 blur-md"></span>
              </span>
            </span>
          </div>
          <div className="flex flex-row w-full justify-between">
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-700">Total Deposit</span>
              <span className="text-xl font-bold text-gray-900">{profile.totalDeposits || "000.00"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-gray-700">Total Withdrawals</span>
              <span className="text-xl font-bold text-gray-900">{profile.totalWithdrawals || "000.00"}</span>
            </div>
          </div>
        </div>

        <div className="mt-10">
          {tableConst.map((item, index) => (
            <Link href={item.link || ""} key={index}>
              <Button
                onClick={item.action}
                variant={"outline"}
                size="lg"
                className="w-full hover:bg-[#31a086] flex text-lg hover:border-2 hover:underline active:border-teal-200 justify-start text-[#0A493A] font-bold my-2"
              >
                {item.name}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
