import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const usePlaylistContent = (playlistId: string | undefined, searchTerm?: string) => {
  
  let apiUrl = playlistId? `/api/playlist/${playlistId}`: `/api/playlist/1`
  if(searchTerm){
    apiUrl += `?search=${searchTerm}`
  }
  const { data, error, isLoading, mutate } = useSwr(apiUrl , fetcher, {
  });
  return {
    data,
    error,
    isLoading,
    mutate
  }
};

export default usePlaylistContent;