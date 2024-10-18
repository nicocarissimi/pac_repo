import React, { useCallback, useEffect, useState } from 'react';
import { PlaylistInterface } from '@/libs/definitions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
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
import { ScrollArea } from '../ui/scroll-area';
import PlaylistModal from './PlaylistModal';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import usePlaylist from '@/hooks/usePlaylist';
import { Button } from '../ui/button';
import Image from "next/image"
interface PlaylistDisplayProps {
  myPlaylists: boolean;
  setPlaylistId?: (id: string) => void;
  playlistSearch: string;
}

const SidebarList: React.FC<PlaylistDisplayProps> = ({ myPlaylists, setPlaylistId, playlistSearch }) => {

  const { mutate } = useSWRConfig()
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const { data: playlist = [] } = usePlaylist(myPlaylists, '', playlistSearch) as { data: PlaylistInterface[] };
  const [playlistFiltered, setPlaylist] = useState([] as PlaylistInterface[]) 
  const [ selectedPlaylist, setSelectPlaylist ] = useState({} as PlaylistInterface);

  useEffect(() => {
    if(playlist.length > 0) {
      setSelectPlaylist(playlist[0]);
      handleShowPlaylistContent(playlist[0]);
      setPlaylist(playlist)
    }
    else{
      setPlaylist([])
    }
  },[playlist]);

  const handleShowPlaylistContent = (playlist: PlaylistInterface) => {
    if (setPlaylistId) {
      setPlaylistId(playlist.id);
    }
  };

  const handlePlaylistSelect = useCallback((playlist: PlaylistInterface) => {
    setSelectPlaylist(playlist)
    console.log(selectedPlaylist.id);
  },[selectedPlaylist]);

  const handleEditPlaylist = (id: string, name: string, isPub: boolean) => {
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
            {playlistFiltered.map((playlist) => (
              <div
                key={playlist.id}
                className={`h-15 flex items-center gap-3 px-4 py-2 rounded-md cursor-pointer transition-colors ${selectedPlaylist.id === playlist.id ? "bg-primary-foreground text-black" : "hover:bg-muted hover:text-black"
                  }`}
                onClick={() => {
                  handlePlaylistSelect(playlist);
                  handleShowPlaylistContent(playlist)
                }}
              >
                <div className="flex my-2 justify-start">
                  {playlist.thumbnailUrl &&(
                    <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover bg-gray-400"
                    height="100"
                    src={playlist.thumbnailUrl}
                    width="100"
                  />
                  )}
                  </div>
                <div className='flex-1 my-2'>
                  {playlist.name}
                </div>
                {(myPlaylists) && (
                  //Dropdown Menu for Playlist Actions
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid="action-button">
                        <Ellipsis className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem data-testid="edit-button" asChild onClick={() => handleEditPlaylist(playlist.id, playlist.name, playlist.isPublic)}>
                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-acc focus:text-accent-foreground">
                          <Edit className="mr-2 h-4 w-4"/>
                          <span>Edit</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <AlertDialog open={showAlert}>
                          <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-acc focus:text-accent-foreground">
                            <Trash className="mr-2 h-4 w-4" />
                            <span data-testid="delete-button" onClick={handleToggleAlert}>Delete Playlist</span>
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
      {showModal && (
        <PlaylistModal
          playlist={{ id: selectedPlaylist.id, name: playlistName, isPublic: isPublic, thumbnailUrl: ''}}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};

export default SidebarList;