import { useState } from 'react';

// Fetcher function to call the API
const fetcher = async (url: string | URL | Request, options: RequestInit | undefined) => {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to run the update');
  }
  return data;
};

// Hook to use the SWR
export function useManualUpdate() {
  const [isUpdating, setIsUpdating] = useState(false);

  const runUpdate = async (url: string | Request | URL, method = 'POST', body = null) => {
    setIsUpdating(true);
    try {
      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
      };

      const data = await fetcher(url, options);
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error('An unknown error occurred');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    runUpdate,
    isUpdating,
  };
}
