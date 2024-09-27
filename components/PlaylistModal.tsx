import React from 'react';
import ToggleSwitch from '@/components/ToggleSwitch';

interface PlaylistModalProps {
  playlistName: string;
  setPlaylistName: (value: string) => void;
  isPublic: boolean;
  setIsPublic: (value: boolean) => void;
  onClose: () => void;
  onSave: () => void;
}

const PlaylistModal: React.FC<PlaylistModalProps> = ({
  playlistName,
  setPlaylistName,
  isPublic,
  setIsPublic,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-black p-8 rounded-lg w-[500px]">
        <h2 className="text-white text-2xl mb-4">Create New Playlist</h2>
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