import React from 'react';
import { PlaylistInterface } from '@/types';

interface PlaylistDisplayProps {
  playlists: PlaylistInterface[];
  myPlaylists: boolean;
}

const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({ playlists, myPlaylists }) => {
  return (
    <div className="flex flex-col gap-2">
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="flex flex-row gap-2 rounded-2xl bg-zinc-800 text-white p-2 relative"
        >
          <span>{playlist.name}</span>
          {myPlaylists && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="absolute right-3 top-2 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlaylistDisplay;