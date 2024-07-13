import React from 'react'
import HomePage from './profile'
import UserProfile from '@/app/components/UserProfile'
import Profile from './profile'
import { getServerSession } from 'next-auth/next'
import authOptions from '@/lib/configs/auth/authOptions'

const page = async() => {

  const session = await getServerSession(authOptions) 
  
  return (
    <div className=' flex justify-center items-center w-full h-full bg-red-700 md:mt-10 '>
     <Profile user={session?.user} />
    </div>
  )
}

export default page