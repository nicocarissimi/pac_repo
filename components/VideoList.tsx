import React from 'react';

import { isEmpty } from 'lodash';
import { VideoInterface } from '@/libs/definitions';
import VideoCard from './VideoCard';

interface VideoListProps {
  data: VideoInterface[];
  title: string;
}

const MovieList: React.FC<VideoListProps> = ({ data, title }) => {
  if (isEmpty(data)) {
    return null;
  }

  return (
    <div className="px-4 md:px-12 mt-4 space-y-8">
      <div>
        <p className="text-white text-md md:text-xl lg:text-2xl font-semibold mb-4">{title}</p>
        <div className="grid grid-cols-4 gap-2">
          {data.map((movie) => (
            <VideoCard key={movie.id} data={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieList;
