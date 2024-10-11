import React, { useCallback, useEffect, useState } from 'react';
import { PlaylistInterface } from '@/libs/definitions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Ellipsis, Trash, Edit } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import PlaylistModal from './PlaylistModal';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import usePlaylist from '@/hooks/usePlaylist';
import CheckIcon from '@heroicons/react/24/solid/CheckIcon';
import { Button } from './ui/button';
interface PlaylistDisplayProps {
  myPlaylists: boolean;
  showControls?: boolean;
  videoId?: string;
  closePlaylistModal?: () => void;
  setPlaylistId?: (id: string) => void;
}

const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({ myPlaylists, showControls, videoId, setPlaylistId, closePlaylistModal }) => {

  const { mutate } = useSWRConfig()
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const { data: playlist = [] } = usePlaylist(myPlaylists, videoId) as { data: PlaylistInterface[] };
  const [ selectedPlaylist, setSelectPlaylist ] = useState({} as PlaylistInterface);

  useEffect(() => {
    if(playlist.length > 0) {
      setSelectPlaylist(playlist[0]);
      if(!videoId) {
        handleShowPlaylistContent(playlist[0]);
      }
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

  const handleShowPlaylistContent = (playlist: PlaylistInterface) => {
    if (setPlaylistId) {
      setPlaylistId(playlist.id);
    }
  };

  const handlePlaylistSelect = useCallback((playlist: PlaylistInterface) => {
    setSelectPlaylist(playlist)
    console.log(selectedPlaylist.id);
  },[selectedPlaylist]);

  const handleEditPlaylist =(id: string, name: string, isPub: boolean) => {
    setPlaylistId!(id)
    setPlaylistName(name);
    setIsPublic(isPub);
    console.log('Editing playlist:', id, name, isPub);
    setShowModal(true);
  };
  const handleDeletePlaylist = useCallback(async () => {
    console.log('Deleting playlist:', selectedPlaylist.id);
    try {
      await axios.delete(`/api/playlist/${selectedPlaylist.id}`, {
      });
    }
    catch (error) {
      console.log(error);
    }
    setSelectPlaylist({} as PlaylistInterface);
    handleToggleAlert();
    await mutate('/api/playlist');
    await mutate(`/api/playlist/${selectedPlaylist.id}`)
    if(playlist.length > 0){
      setPlaylistId!(playlist[0].id);
    }   
  },[selectedPlaylist]);

  const handleToggleAlert = () => {
    setShowAlert(s => !s);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
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
                onClick={() => {
                  handlePlaylistSelect(playlist);
                  if (!videoId) {
                    handleShowPlaylistContent(playlist)
                  }
                }}
              >
                <div className="flex-1 my-2">{playlist.name}</div>
                {(selectedPlaylist.id === playlist.id && !showControls) && (<CheckIcon className="w-5 h-5" />)}
                {(myPlaylists && showControls) && (
                  //Dropdown Menu for Playlist Actions
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Ellipsis className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild onClick={() => handleEditPlaylist(playlist.id, playlist.name, playlist.isPublic)}>
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-acc focus:text-accent-foreground">
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <AlertDialog open={showAlert}>
                          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-acc focus:text-accent-foreground">
                            <Trash className="mr-2 h-4 w-4" />
                            <span onClick={handleToggleAlert}>Delete Playlist</span>
                          </div>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                playlist.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={handleToggleAlert}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePlaylist()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      {!showControls && (
        <>
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
      )}
      {showModal && (
        <PlaylistModal
          playlist={{ id: selectedPlaylist.id, name: playlistName, isPublic: isPublic, thumbnailUrl: ''}}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default PlaylistDisplay;