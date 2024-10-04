import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const useCategories = () => {
  const { data, error, isLoading, mutate } = useSwr('/api/categories', fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useCategories;
