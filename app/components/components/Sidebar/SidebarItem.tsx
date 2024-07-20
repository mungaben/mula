
"use client"
import React from "react";
import Link from "next/link";

interface SidebarItemProps {
  item: {
    icon?: React.ReactNode;
    label?: string;
    route?: string;
    action?: () => void;
  };
  pageName: string;
  setPageName: (name: string) => void;
}

const SidebarItem = ({ item, pageName, setPageName }: SidebarItemProps) => {


  const handleClick = () => {
    if (item.action) {
      console.log("itemaction",item.action);
      
      item.action();
    }
    if (item.label) {
      setPageName(item.label);
    }
  };

  if (!item.label) {
    return null; // Skip rendering if label is undefined
  }

  const isActive = pageName && pageName.toLowerCase() === item.label.toLowerCase();

  const commonClasses = `group relative flex items-center gap-3 rounded-[7px] px-3.5 py-3 font-medium duration-300 ease-in-out ${
    isActive
      ? "bg-primary/[.07] text-primary dark:bg-white/10 dark:text-white"
      : "text-dark-4 hover:bg-gray-2 hover:text-dark dark:text-gray-5 dark:hover:bg-white/10 dark:hover:text-white"
  }`;

  return (
    <li>
      {item.route ? (
        <Link href={item.route} className={commonClasses} onClick={handleClick}>
          {item.icon && <span>{item.icon}</span>}
          {item.label}
        </Link>
      ) : (
        <button className={commonClasses} onClick={handleClick}>
          {item.icon && <span>{item.icon}</span>}
          {item.label}
        </button>
      )}
    </li>
  );
};

export default SidebarItem;
