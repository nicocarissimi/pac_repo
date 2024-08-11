import React from 'react'
import RootLayout from '../components/layout'
import useMovieList from '@/hooks/useMovieList';
import MovieList from '@/components/MovieList';


const Playlist = () => {
  const { data: movies = [] } = useMovieList();

  const handleChangeSearchValue = (value: string) => {
    console.log(value)
  }

  return (
    <RootLayout onChangeValue={handleChangeSearchValue}>
      <div className='w-full h-full text-white flex flex-col'>
        <div className='relative mt-20'>
          <MovieList title="My Playlist 1 relative" data={movies} />
        </div>
      </div>
    </RootLayout>
  )
}


export default Playlist