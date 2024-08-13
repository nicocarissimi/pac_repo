import React, { useState } from 'react'
import RootLayout from '../components/layout'
import useMovieList from '@/hooks/useMovieList';
import { Playlist } from '@/types';
import ContentList from '@/components/ContentList';
import ToggleSwitch from '@/components/ToggleSwitch';


const PlaylistPage = () => {
  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
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
  const handleSavePlaylist = () => {
    const newPlaylist = {
      name: playlistName,
      isPublic,
    };
    // Here you would typically update the playlist state or make an API call to save the playlist
    console.log('New Playlist:', newPlaylist);
    handleCloseModal();
  };
  

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
      <div className='flex w-full h-[850px] absolute mt-20 justify-around gap-10 p-10'>
          <div className='flex flex-col h-full justify-between w-[40%]'>
            <div className='rounded-xl p-8 bg-gray-500 h-[80%]'>
            <input id='search' className='bg-black rounded-2xl p-2 text-white placeholder:text-white w-full' placeholder='search your father' />
            <div className='flex flex-col justify-between h-[90%] w-full'>
              <div className='flex flex-col gap-2 mt-10'>
              {playlists.map((playlist) =>{
                return <div className='rounded-2xl bg-black text-white p-2' key={playlist.id}>{playlist.name}</div>
              })}
              </div>
              <ToggleSwitch />
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