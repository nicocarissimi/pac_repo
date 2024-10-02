import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const usePlaylist = (hot?: boolean) => {
  const { data, error, isLoading, mutate } = useSwr(hot ? '/api/playlists?hot=1' : '/api/playlists', fetcher, {
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