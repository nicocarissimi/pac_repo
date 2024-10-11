import React, { useCallback, useEffect, useState } from 'react';
import ToggleSwitch from '@/components/ToggleSwitch';
import { useSWRConfig } from 'swr';
import axios from 'axios';
import { PlaylistInterface } from '@/libs/definitions';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { DialogHeader, DialogFooter } from './ui/dialog';


interface PlaylistModalProps {
  playlist?: PlaylistInterface;
  onClose: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  playlist,
  onClose,
}) => {
  const {mutate} = useSWRConfig();
  const [playlistName, setPlaylistName] = useState(playlist? playlist.name : ''  );
  const [isPublic, setIsPublic] = useState(playlist? playlist.isPublic : true);

  const onSave = useCallback(async() =>{
    const Playlist = {
      name: playlistName,
      isPublic,
      id: playlist? playlist.id : null,
    };
    try {
      if(!playlist){
        await axios.post('/api/playlist', {
          Playlist
        }).then((response) => {
        console.log('New Playlist:', Playlist);
        });
      }else{
        console.log("Updating playlist:", Playlist);
        await axios.put('/api/playlist', {
          Playlist
        }).then((response) => {
          console.log('Updated Playlist:', Playlist);
          });;
      }
    }
      catch (error) {
        console.log(error);
    }
    // Here you would typically update the playlist state or make an API call to save the playlist
    mutate('/api/playlist');
    onClose();
  }, [playlistName, isPublic, playlist]);
  return (
    <Dialog defaultOpen>
      <DialogContent className="bg-primary" onInteractOutside={(e) => {
          e.preventDefault();}}>
        <DialogHeader className='text-white'>
          <DialogTitle>{playlist? 'Edit Playlist': 'Create Playlist'}</DialogTitle>
          <DialogDescription>
            Enter a name for your new playlist and choose if it should be public or private.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 text-white">
          <div className="grid items-center grid-cols-4 gap-4 ">
            <Label htmlFor="name" className="text-right text-base font-semibold">
              Playlist Name
            </Label>
            <Input id="name" placeholder="My Playlist" value={playlistName} className="col-span-3 bg-zinc-800 border-0" onChange={(e) => setPlaylistName(e.target.value)}/>
          </div>
          <div className="grid items-center grid-cols-4 gap-4">
            <Label htmlFor="visibility" className="text-right text-base font-semibold">
              Visibility
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
            <ToggleSwitch
            option1="Public"
            option2="Private"
            boolFlag={isPublic}
            setBool={setIsPublic}
          />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" className="mr-2 bg-black text-base text-white border-0 font-semibold" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className='bg-white hover:bg-zinc-400 text-black text-base font-semibold' onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    
  );
};

export default PlaylistModal;