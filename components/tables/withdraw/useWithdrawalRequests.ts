// hooks/useWithdrawalRequests.ts
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useWithdrawalRequests = () => {
  const { data, error, mutate } = useSWR('/api/withdrawals', fetcher);

  return {
    data,
    error,
    loading: !error && !data,
    refresh: mutate, // mutate will be used to revalidate the data
  };
};
