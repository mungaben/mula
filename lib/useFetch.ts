

"use client"

import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error('An error occurred while fetching the data.');
    (error as any).info = await response.json();
    (error as any).status = response.status;
    throw error;
  }
  return response.json();
};

const useFetch = <Data = any, Error = any>(
  url: string,
  options?: SWRConfiguration
): SWRResponse<Data, Error> => {
  return useSWR<Data, Error>(url, fetcher, options);
};

export default useFetch;
