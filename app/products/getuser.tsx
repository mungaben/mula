import { getSession } from 'next-auth/react'
import React from 'react'

const getuser = async() => {

    const session =await getSession()
    console.log(session)

    if (!session) {
        return 
        
    }
  return session.user
}

export default getuser