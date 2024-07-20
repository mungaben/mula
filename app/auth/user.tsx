import authOptions from "@/lib/configs/auth/authOptions"
import { getServerSession } from "next-auth/next"


export default async function Page() {
  const session = await getServerSession(authOptions)
  return <pre>{JSON.stringify(session, null, 2)}</pre>
} 