import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddVideoPlaylist from './AddVideoPlaylist';
interface FavoriteButtonProps {
  movieId: string
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ movieId }) => {

  const [showModal, setShowModal] = useState(false);

  const toggleShowModal = ()=>{
    setShowModal(s=>!s);
  }
  

  return (<>
    <div onClick={toggleShowModal} className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300">
      <PlusIcon className="text-white group-hover/item:text-neutral-300 w-4 lg:w-6" />
    </div>
    {showModal && (
        
        <AddVideoPlaylist
              videoId={movieId}        
        />
        
      )}
    </>
  )
}

export default FavoriteButton;
