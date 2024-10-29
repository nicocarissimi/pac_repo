import React, { useEffect } from 'react'
import { VideoInterface } from '@/libs/definitions';
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import usePlaylistContent from '@/hooks/usePlaylistContent';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from './ui/dropdown-menu';
import { Ellipsis, Trash, Plus } from 'lucide-react';
import usePlaylistModalStore from '@/hooks/usePlaylistModalStore';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { useRouter } from 'next/router';
import useVideo from '@/hooks/useVideo';
import EmptyContent from './playlist/EmptyContent';
import { Card, CardHeader, CardTitle, CardDescription } from './ui/card';

interface ContentListProps {
  myPlaylists: boolean
  playlistId: string;
  videoSearch?: string;
}

const ContentList: React.FC<ContentListProps> = ({ playlistId,videoSearch, myPlaylists }) => {

  const { mutate, cache } = useSWRConfig();
  const router = useRouter();
  const { openPlaylistModal } = usePlaylistModalStore();
  const { data: videoList = [] } = usePlaylistContent(playlistId,videoSearch) as { data: VideoInterface[] };

  const deleteVideoFromPlaylist = async(video: VideoInterface) =>{
    if(video?.id){
      const videoId = video.id;
      try {
        await axios.delete(`/api/playlist/${playlistId}`, {
          data: { videoId }
        }).then(() => {
          mutate(`/api/playlist/${playlistId}`);
          mutate(`/api/playlist`);
        });
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error.response && error.response.status === 409) {
                console.error('Video is already in the playlist');
                alert('This video is already in the playlist');
              } else {
                console.error('An error occurred while adding the video to the playlist:', error);
                alert('Error adding the video to the playlist');
              }
            } else {
              // Handle non-Axios errors
              console.error('An unknown error occurred:', error);
              alert('An unknown error occurred');
            }
          }
      }
    };
  if(videoList.length===0){
    if (videoSearch){
      return(<>
      <Card className="w-full max-w-3xl mx-auto bg-zinc-800 text-background border-0">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">No matches for "{videoSearch}"</CardTitle>
                <CardDescription>Try again using a different keyword</CardDescription>
            </CardHeader>
      </Card>
      </>)
    }
    if (playlistId==='0'){
      return(<>
      <Card className="w-full max-w-3xl mx-auto bg-zinc-800 text-background border-0">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">We couldn't find anything</CardTitle>
                <CardDescription>Try selecting another playlist or change the search term</CardDescription>
            </CardHeader>
      </Card>
      </>)
    }
    return (
      <EmptyContent playlistId={playlistId}/>
    )
  }

  return (
    <ScrollArea className="h-full w-full rounded-md">
      {videoList.map((video) => (
        <div key={video?.id}>
          <div id="card" className="w-full h-auto rounded-2xl p-4 mb-4 bg-zinc-800 text-white relative">
            <div className="flex justify-between items-center">

              {/* Video Thumbnail and Info */}
              <div className="flex w-full gap-4 h-full mt-2">
                {/* Video Thumbnail */}
                <div className="w-[20%] h-[200px] bg-cover bg-center rounded-2xl" style={{ backgroundImage: `url(${video.thumbnailUrl})` }}></div>

                {/* Video Info */}
                <div className="w-[70%] h-full flex flex-col justify-between">
                  <div className="text-lg font-bold text-white">{video.title}</div>
                  <div className="text-gray-400 text-sm">Duration: {video.duration}</div>
                  <div className="text-gray-300 text-sm">{video.description.substring(0, 100)}...</div>
                  <a
                    onClick={() => router.push(`/watch/${video.id}`)}
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline text-sm"
                  >
                    Watch Video
                  </a>
                </div>
              </div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger className="flex flex-row">
                  {/* Ellipsis icon */}
                  <Ellipsis size={"24px"} className="rotate-90" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white text-black " align="end">
                  <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-acc focus:text-accent-foreground hover:rounded-none hover:bg-zinc-100">
                    <Plus className="mr-2 h-4 w-4" />
                    <span onClick={() => openPlaylistModal(video.id!)}>Add to other playlist</span>
                  </div>
                  {myPlaylists && (<DropdownMenuItem asChild>
                      <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-acc focus:text-accent-foreground hover:rounded-none hover:bg-zinc-100">
                        <Trash className="mr-2 h-4 w-4" />
                        <span onClick={()=>deleteVideoFromPlaylist(video)}>Delete from playlist</span>
                      </div>
                  
                  </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            </div>

          <Separator className="my-2" />
        </div>
      ))
      }

    </ScrollArea>
  )
}

export default ContentList;
