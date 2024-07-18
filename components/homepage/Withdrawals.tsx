import React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"



const Withdrawals = () => {
  return (
    <Card className='max-w-screen-sm bg-red-200 flex flex-col'>
      <CardHeader className="flex flex-row gap-5">
        <CardTitle>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

        </CardTitle>
        <CardDescription className='flex flex-col'>
          <span>
            07***9079
          </span>
          <span>
            4000
          </span>
        </CardDescription>
      </CardHeader>

    </Card>

  )
}

export default Withdrawals