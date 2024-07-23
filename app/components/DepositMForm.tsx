"use client"

import React, { useState } from 'react'
import { Check, Copy, RefreshCcw } from "lucide-react";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import useModuleStore from '@/lib/storage/modules';
import toast from 'react-hot-toast';
import useFetch from '@/lib/useFetch';


export type PhoneNumber = {
    phoneNumber: string;
  };


const DepositMForm = () => {

    const { data: phoneNumbers, error, isLoading } = useFetch<PhoneNumber[]>('/api/phonenumbers');


    const { depositModule, toggleDepositModule } = useModuleStore();


    const [selectedNumber, setSelectedNumber] = useState<string>('');

    const handleCopy = async (number: string) => {
      try {
        await navigator.clipboard.writeText(number);
        toast.success('Number copied to clipboard!');
        setSelectedNumber(number);

      } catch (err) {
        toast.error('Failed to copy number.');
      }
    
      setTimeout(()=>{
        toggleDepositModule()
      },2000)
     
    };
  
    return (
        <Dialog open={depositModule} onOpenChange={toggleDepositModule}  >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Deposit</DialogTitle>
                    <DialogDescription>
                        choose a number to deposit.
                    </DialogDescription>
                </DialogHeader>
                <div className="p-4">
                    <div className="mb-4">
                        <input
                            type="text"
                            value={selectedNumber}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        {phoneNumbers.map((number, index) => (
                            <div
                                key={index}
                                className="p-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-100 text-black dark:text-white"
                                onClick={() => handleCopy(number)}
                            >
                                {number}
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>

    )
}

export default DepositMForm