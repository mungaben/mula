// app/account/page.tsx
import { signOut } from 'next-auth/react';
import DeleteAccountButton from '@/components/DeleteAccountButton';
import { Button } from '@/components/ui/button';


export default function AccountPage() {
  return (
    <div>
      <h1>Account</h1>
      <Button onClick={() => signOut()}>Log Out</Button>
      <DeleteAccountButton />
    </div>
  );
}
