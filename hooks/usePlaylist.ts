import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const usePlaylist = (personalPlaylist: boolean, videoId?:string | undefined, searchTerm?:string | undefined) => {
  let apiUrl = personalPlaylist ? '/api/playlist' : '/api/playlist?hot=1';
  // If videoId is provided, add it to the query string to exclude playlists that already contain the video
  if (videoId) {
    apiUrl += `?videoId=${videoId}`;
  }
  if (searchTerm){
    if(apiUrl.includes('?')){
      apiUrl += `&search=${searchTerm}`;
    }
    else{
      apiUrl += `?search=${searchTerm}`;
    }
    
  }

  const { data, error, isLoading, mutate } = useSwr(apiUrl, fetcher, {
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