import FormElements from "@/app/components/components/FormElements";
import DefaultLayout from "@/app/components/components/Layouts/DefaultLaout";
import { Metadata } from "next";
import React from "react";


export const metadata: Metadata = {
  title: "Next.js Form Elements Page | TikEarn - Next.js Dashboard Kit",
  description: "This is Next.js Form Elements page for TikEarn Dashboard Kit",
};

const FormElementsPage = () => {
  return (
    <DefaultLayout>
      <FormElements />
    </DefaultLayout>
  );
};

export default FormElementsPage;
