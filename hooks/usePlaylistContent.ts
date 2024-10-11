import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const usePlaylistContent = (playlistId: string | undefined) => {
  const { data, error, isLoading, mutate } = useSwr(playlistId? `/api/playlist/${playlistId}`: `/api/playlist/1` , fetcher, {
  });
  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default usePlaylistContent;