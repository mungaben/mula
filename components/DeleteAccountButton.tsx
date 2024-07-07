
"use client"
// components/DeleteAccountButton.tsx

import axios from 'axios';
import { useRouter } from 'next/router';
import { Button } from './ui/button';

export default function DeleteAccountButton() {
  const router = useRouter();

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('/api/auth/delete');
      router.push('/auth/signin');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  return (
    <Button onClick={handleDeleteAccount}>Delete Account</Button>
  );
}
