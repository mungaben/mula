import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import '../globals.css';
import { auth } from '@/lib/configs/auth/auth';
import { redirect } from 'next/navigation'


const inter = Inter({ subsets: ['latin'] });

export default async function RootLayout({
  children
}: {

  children: React.ReactNode;
}) {
  const session = await auth();



 
  const userEmail= session?.user.email
  const adminEmailsString= process.env.ADMIN

  if (!userEmail) {
    redirect('/auth/signin')
  }

 

 /// Convert the comma-separated string into an array and trim each element
const adminEmails = adminEmailsString
? adminEmailsString.split(',').map(email => email.trim().replace(/^'|'$/g, ''))
: [];
console.log("adminemails", adminEmails, userEmail);

// Check if the user's email is in the admin emails array
const isAdmin = adminEmails.includes(userEmail);

console.log("isitan admn", isAdmin);

if (!isAdmin) {
redirect("/");
}

  



  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <NextTopLoader showSpinner={false} />
        <Providers session={session}>
          <Toaster />
          {children}
        </Providers>
      </body>
    </html>
  );
}
