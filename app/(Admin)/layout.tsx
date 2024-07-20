import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import '../globals.css';
import { auth } from '@/lib/configs/auth/auth';
import { getSession } from 'next-auth/react';
import { redirect } from 'next/navigation';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next Shadcn',
  description: 'Basic dashboard with Next.js and Shadcn'
};

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

 

 // Convert the comma-separated string into an array
 const adminEmails = adminEmailsString ? adminEmailsString.split(',') : [];
    
 // Check if the user's email is in the admin emails array
 const isAdmin = adminEmails.includes(userEmail);


 if(!isAdmin){
  redirect("/")
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
