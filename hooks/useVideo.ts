import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const useVideo = (id?: string) => {
  const { data, error, isLoading } = useSwr(id ? `/api/videos/${id}` : `/api/videos`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    data,
    error,
    isLoading
  }
};

export default useVideo;
