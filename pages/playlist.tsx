import React from 'react'
import RootLayout from '../components/layout'
import useMovieList from '@/hooks/useMovieList';
import { Playlist } from '@/types';
import ContentList from '@/components/ContentList';
import ToggleSwitch from '@/components/toggleSwitch';


const PlaylistPage = () => {
  const { data: movies = [] } = useMovieList();

  const handleChangeSearchValue = (value: string) => {
    console.log(value)
  }

  const playlists: Playlist[] = [
    {id: "1", name:"primo nome a caso"},
    {id: "2", name:"secondo nome a caso"},
    {id: "3", name:"terzo nome a caso"},
    {id: "4", name:"quarto nome a caso"},
  ]

  return (
    <RootLayout onChangeValue={handleChangeSearchValue}>
      <div className='flex w-full h-[800px] absolute mt-20 justify-around gap-10 p-10'>
          <div className='flex flex-col h-full justify-between w-[40%]'>
            <div className='rounded-xl p-8 bg-gray-500 h-[80%]'>
            <input id='search' className='bg-black rounded-2xl p-2 text-white placeholder:text-white w-full' placeholder='search your father' />
            <div className='flex flex-col justify-between h-[90%] w-full'>
              <div className='flex flex-col gap-2 mt-10'>
              {playlists.map((playlist) =>{
                return <div className='rounded-2xl bg-black text-white p-2'>{playlist.name}</div>
              })}
              </div>
              <ToggleSwitch />
            </div>
          </div>
          <button className='p-10 bg-black rounded-2xl w-full relative text-white'>Add playlist</button>
        </div>
        <div className='rounded-xl p-8 w-[100%] bg-gray-500'>
          <input className='rounded-2xl bg-black w-full p-2 text-white placeholder:text-white' placeholder='search your mother' />
          <ContentList />
        </div>
      </div>
    </RootLayout>
  )
}


export default PlaylistPage