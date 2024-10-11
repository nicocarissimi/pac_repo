import React, { useCallback, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

import PlayButton from '@/components/PlayButton';
import FavoriteButton from '@/components/FavoriteButton';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import useVideo from '@/hooks/useVideo';
import usePlaylistModalStore from '@/hooks/usePlaylistModalStore';
import PlaylistDisplay from './PlaylistDisplay';

const PlaylistContentModal = () => {
  

  const { videoId, isOpenPlaylist,closePlaylistModal} = usePlaylistModalStore();
  const handleClose = useCallback(() => {
    setTimeout(() => {
        closePlaylistModal();
    }, 300);
  }, [closePlaylistModal]);

  if (!isOpenPlaylist) {
    return null;
  }

  return (
    <div className="z-50 transition duration-300 bg-black bg-opacity-80 flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0">
      <div className="relative w-auto mx-auto rounded-md overflow-hidden">
        <div className="scale-100 transform duration-300 relative flex-auto bg-zinc-900 drop-shadow-md">

          <div className="relative h-16 w-96">
          <h2 className="text-white text-2xl p-4">Select Playlist</h2>
            <div onClick={handleClose} className="cursor-pointer absolute top-3 right-3 h-10 w-10 rounded-full bg-black bg-opacity-70 flex items-center justify-center">
              <XMarkIcon className="text-white w-6" />
            </div>
            
        </div>
        <PlaylistDisplay myPlaylists={true} videoId={videoId} closePlaylistModal={closePlaylistModal}/>
        </div>
      </div>
    </div>
  );
}

export default PlaylistContentModal;
