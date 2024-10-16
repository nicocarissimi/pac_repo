import useSwr from 'swr'
import fetcher from '@/libs/fetcher';

const usePlaylist = (personalPlaylist: boolean, videoId?:string | undefined, searchTerm?: string | undefined, infoVideo?: boolean) => {
  let apiUrl = '/api/playlist'

  const params = new URLSearchParams();

  !personalPlaylist && params.set('hot','1')
  // If videoId is provided, add it to the query string to exclude playlists that already contain the video
  videoId && params.set('videoId', videoId)
  // If infoVideo is true, each playlist also contains a video list, which is a list of all the videos it contains.
  infoVideo && params.set('infoVideo', infoVideo.toString())
  searchTerm && params.set('search', searchTerm)
  
  const finalUrl = params.toString() ? `${apiUrl}?${params.toString()}` : apiUrl;

  const { data, error, isLoading, mutate } = useSwr(finalUrl, fetcher, {
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