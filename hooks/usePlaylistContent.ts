import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const usePlaylistContent = (playlistId: string | undefined, searchTerm?: string) => {

  const isNoPlaylist = !playlistId || playlistId === '0';  // Explicit check for "no playlist" case  let apiUrl = noPlaylist? `/api/playlist/${playlistId}`: `/api/playlist/1`
  let apiUrl = `/api/playlist/${playlistId}`;
  if(searchTerm){
    apiUrl += `?search=${searchTerm}`
  }
  const { data, error, isLoading} = useSwr(!isNoPlaylist? apiUrl:null , fetcher, {
    revalidateIfStale: true
  });
  return {
    data,
    error,
    isLoading
  }
};

export default usePlaylistContent;