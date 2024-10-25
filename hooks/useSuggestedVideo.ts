import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const useSuggestedVideo = () => {
  const { data, error, mutate, isLoading } = useSwr('/api/videos/suggest', fetcher);
  return {
    data,
    mutate,
    error,
    isLoading
  }
};

export default useSuggestedVideo;
