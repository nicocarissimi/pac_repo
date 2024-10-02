import React, { useCallback, useState } from 'react';
import { PlaylistInterface } from '@/types';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Ellipsis, Trash, Edit } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import PlaylistModal from './PlaylistModal';
import { useSWRConfig } from 'swr';
import axios from 'axios';
interface PlaylistDisplayProps {
  playlists: PlaylistInterface[];
  myPlaylists: boolean;
}

const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({ playlists, myPlaylists }) => {
  const { mutate } = useSWRConfig()
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [playlistId, setPlaylistId] = useState('');

  const handleEditPlaylist = (id:string, name:string, isPub: boolean) => {
    setPlaylistId(id)
    setPlaylistName(name);
    setIsPublic(isPub);
    setShowModal(true);
  };
  const handleDeletePlaylist = async(id:string) => {
    console.log('Deleting playlist:', id);
    try {
      await axios.delete(`/api/playlist/${id}`, {
      });
    }
      catch (error) {
        console.log(error);
    }
    handleToggleAlert();
    mutate('/api/playlists');
    mutate('/api/playlists?hot=1');
  };

  const handleToggleAlert = () => {
    setShowAlert(s=>!s);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleSavePlaylist = useCallback(async () => {
    const newPlaylist = {
      name: playlistName,
      isPublic,
    };
    try {
      await axios.put(`/api/playlist/${playlistId}`, {
        ...newPlaylist
      });
    }
      catch (error) {
        console.log(error);
    }
    // Here you would typically update the playlist state or make an API call to save the playlist
    console.log('Edited Playlist:', newPlaylist);
    handleCloseModal();
    mutate('/api/playlists');
    mutate('/api/playlists?hot=1');
  },[playlistName, isPublic, handleCloseModal]);

  return (
  <>
    <ScrollArea className="rounded-md w-full h-full">
      <div className="p-4">
        { playlists.map((p) => (
          <div>
            <div key={p.id} className="text-md text-white flex w-full justify-between">
              <p>{p.name}</p>
              {myPlaylists && (
              <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                  <Ellipsis size={"24px"} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align='end'>
                  <DropdownMenuItem>
                    <Edit className="mr-2 h-4 w-4" />
                    <span onClick={()=> handleEditPlaylist(p.id, p.name, p.isPublic)}>Edit Playlist</span>
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
                    <AlertDialogAction onClick={()=>handleDeletePlaylist(p.id)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>)}
            </div>
            <Separator className='my-2'/>
          </div>
       ))}
      </div>
    </ScrollArea>
    {showModal && (
      <PlaylistModal
        playlist= {{id:playlistId,name:playlistName,isPublic:isPublic}}
        onClose={handleCloseModal}
      />
    )}
    </>
  );
};

export default PlaylistDisplay;