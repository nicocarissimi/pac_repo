import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const useVideo = (id?: string) => {
  const { data, error, mutate, isLoading } = useSwr(id ? `/api/videos/${id}` : `/api/videos`, fetcher);
  return {
    data,
    mutate,
    error,
    isLoading
  }
};

export default useVideo;
