import { getSession } from "next-auth/react";



export const UserLogged= async()=>{
    const session=await  getSession()
    


    return session
}






