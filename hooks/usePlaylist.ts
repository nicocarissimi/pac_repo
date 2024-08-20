import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const usePlaylist = () => {
  const { data, error, isLoading, mutate } = useSwr('/api/playlists', fetcher, {
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

export default usePlaylist;