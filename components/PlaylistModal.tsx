import React, { useCallback, useEffect, useState } from 'react';
import ToggleSwitch from '@/components/ToggleSwitch';
import { PlaylistInterface } from '@/types';
import { useSWRConfig } from 'swr';
import axios from 'axios';


interface PlaylistModalProps {
  playlist?: PlaylistInterface;
  onClose: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  playlist,
  onClose,
}) => {
  const {mutate} = useSWRConfig();
  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(playlist? playlist.isPublic : true);
  useEffect(() => {
    if (playlist) {
      setPlaylistName(playlist.name);
      setIsPublic(playlist.isPublic);
    }
  }, [playlist])

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
        });
      }else{
        console.log("Updating playlist:", Playlist);
        await axios.put('/api/playlist', {
          Playlist
        });
      }
    }
      catch (error) {
        console.log(error);
    }
    // Here you would typically update the playlist state or make an API call to save the playlist
    console.log('New Playlist:', Playlist);
    onClose();
    mutate('/api/playlists');
    mutate('/api/playlists?hot=1');
  }, [playlistName, isPublic, playlist]);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-black p-8 rounded-lg w-[500px]">
        <h2 className="text-white text-2xl mb-4">{playlist? 'Edit Playlist': 'Create Playlist'}</h2>
        <div className="mb-4">
          <label className="block text-white">Playlist Name</label>
          <input
            type="text"
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            placeholder="Enter playlist name"
          />
        </div>
        <div className="mb-4">
          <ToggleSwitch
            option1="Public"
            option2="Private"
            boolFlag={isPublic}
            setBool={setIsPublic}
          />
        </div>
        <div className="flex justify-end gap-4">
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistModal;