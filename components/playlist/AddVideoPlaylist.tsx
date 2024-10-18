import React, { useCallback, useEffect, useState } from 'react';
import { PlaylistInterface } from '@/libs/definitions';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import axios from 'axios';
import usePlaylist from '@/hooks/usePlaylist';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import { Button } from '../ui/button';
import Image from "next/image"
interface PlaylistDisplayProps {
  videoId: string;
  closePlaylistModal?: () => void;
  playlistSearch?: string;
}

const AddVideoPlaylist: React.FC<PlaylistDisplayProps> = ({ videoId, closePlaylistModal }) => {

  const { data: playlist = [] } = usePlaylist(true, videoId) as { data: PlaylistInterface[] };
  const [ selectedPlaylist, setSelectPlaylist ] = useState({} as PlaylistInterface);

  useEffect(() => {
    if(playlist.length > 0) {
      setSelectPlaylist(playlist[0]);
    }
  },[playlist]);

  const handleAddVideo = useCallback(async () => {
    console.log('Adding video:', videoId, ' to playlist:', selectedPlaylist.id );
    try {
      await axios.post(`/api/playlist/${selectedPlaylist.id}`, {
        videoId
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
    // Add video to playlist
    if (closePlaylistModal) {
      closePlaylistModal();
    }
  }, [videoId, selectedPlaylist, closePlaylistModal]);

  const handlePlaylistSelect = useCallback((playlist: PlaylistInterface) => {
    setSelectPlaylist(playlist)
    console.log(selectedPlaylist.id);
  },[selectedPlaylist]);
  
  return (
    <>
      <ScrollArea className="rounded-md w-full h-full">
        <div className="grid gap-4 py-4 text-white">
          <div className='grid gap-2'>
            {playlist.map((playlist) => (
              <div
                key={playlist.id}
                className={`h-15 flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-colors ${selectedPlaylist.id === playlist.id ? "bg-primary-foreground text-black" : "hover:bg-muted hover:text-black"
                  }`}
                onClick={() => handlePlaylistSelect(playlist)}
              >
                <div className='flex-1 my-2'>
                  {playlist.name}
                </div>
                {(selectedPlaylist.id === playlist.id) && (<CheckIcon className="w-5 h-5" />)}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
          <Separator /><div className="grid gap-2">
            <div className="grid gap-2 py-2 px-2 text-white">
              <div className="w-full" hidden={selectedPlaylist.id !== ""}>
                <div className="text-sm text-red-500 text-center">
                  You need to choose one playlist
                </div>
              </div>
              <Button className="text-lg text-white bg-black hover:text-black hover:bg-white font-bold" disabled={selectedPlaylist.id === ""} onClick={handleAddVideo}>
                Add to Playlist
              </Button>
            </div>

          </div>
    </>
  );
};

export default AddVideoPlaylist;