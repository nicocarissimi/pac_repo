import React, { useCallback, useState } from 'react'
import RootLayout from '../components/layout'
import useMovieList from '@/hooks/useMovieList';
import { PlaylistInterface } from '@/types';
import ContentList from '@/components/ContentList';
import ToggleSwitch from '@/components/ToggleSwitch';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import axios from 'axios';
import usePlaylist from '@/hooks/usePlaylist';
import { useSWRConfig } from 'swr';
import useHotPlaylist from '@/hooks/useHotPlaylist';



export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}

// useState -> useEffect chiama usePlaylist

const PlaylistPage = () => {
  const { mutate } = useSWRConfig()
  const { data: user_playlist = [] } = usePlaylist();
  const { data: hot_playlist=[]} = useHotPlaylist();
  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [myPlaylists, setMyPlaylists] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const { data: movies = [] } = useMovieList();
  const handleAddPlaylist = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleToggleSwitch = () => {
    setIsPublic(!isPublic);
  };
  const handleSavePlaylist = useCallback(async () => {
    const newPlaylist = {
      name: playlistName,
      isPublic,
    };
    try {
      await axios.post('/api/playlist', {
        ...newPlaylist
      });
    }
      catch (error) {
        console.log(error);
    }
    // Here you would typically update the playlist state or make an API call to save the playlist
    console.log('New Playlist:', newPlaylist);
    handleCloseModal();
    mutate('/api/playlists')
  },[playlistName, isPublic, handleCloseModal]);
  

  const handleChangeSearchValue = (value: string) => {
    console.log(value)
  }

  const playlists: PlaylistInterface[] = [
    {id: "1", name:"primo nome a caso", userId:"123", isPublic: false},
    {id: "2", name:"secondo nome a caso", userId:"123", isPublic: false},
    {id: "3", name:"terzo nome a caso", userId:"123", isPublic: false},
    {id: "4", name:"quarto nome a caso", userId:"123", isPublic: false},
  ]

  return (
    <RootLayout onChangeValue={handleChangeSearchValue}>
      <div className='flex w-full h-[850px] absolute mt-20 justify-around gap-10 p-10'>
          <div className='flex flex-col h-full justify-between w-[40%]'>
            <div className='rounded-xl p-8 bg-gray-500 h-[80%]'>
            <input id='search' className='bg-black rounded-2xl p-2 text-white placeholder:text-white w-full' placeholder='search your father' />
            <div className='flex flex-col justify-between h-[90%] w-full'>
              {myPlaylists? (<div className='flex flex-col gap-2 mt-10'>
              {user_playlist ? user_playlist.map((playlist: PlaylistInterface) =>{
                return <div className='rounded-2xl bg-black text-white p-2' key={playlist.id}>{playlist.name}</div>
              }): playlists.map((playlist: PlaylistInterface) =>{
                return <div className='rounded-2xl bg-black text-white p-2' key={playlist.id}>{playlist.name}</div>
              })}
              
              </div>):
              (<div className='flex flex-col gap-2 mt-10'>
                {hot_playlist.map((playlist: PlaylistInterface) =>{
                  return <div className='rounded-2xl bg-black text-white p-2' key={playlist.id}>{playlist.name}</div>
                })}
                
                </div>)
              }
              
              <ToggleSwitch 
              option1='My playlists'
              option2='Trending now'
              boolFlag = {myPlaylists}
              setBool={setMyPlaylists}
              />
            </div>
          </div>
          <button className='p-10 bg-gray-500 rounded-2xl w-full relative text-white' onClick={handleAddPlaylist}>Add playlist</button>
        </div>
        <div className='rounded-xl p-8 w-[100%] bg-gray-500 flex flex-col gap-6'>
          <input className='rounded-2xl bg-black w-full p-2 text-white placeholder:text-white' placeholder='search your mother' />
          <ContentList />
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-black p-8 rounded-lg w-[500px]">
            <h2 className=" text-white text-2xl mb-4">Create New Playlist</h2>
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
                option1='Public'
                option2='Private'
                boolFlag = {isPublic}
                setBool={setIsPublic}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSavePlaylist}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </RootLayout>
  )
}


export default PlaylistPage