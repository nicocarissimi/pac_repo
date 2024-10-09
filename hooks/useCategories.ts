import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const useCategories = () => {
  const { data, error, isLoading, mutate } = useSwr('/api/categories', fetcher);
  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default useCategories;
