import React, { useCallback, useState } from 'react'
import RootLayout from '../components/layout'
import ContentList from '@/components/ContentList';
import ToggleSwitch from '@/components/ToggleSwitch';
import SidebarList from '@/components/playlist/SidebarList';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';
import PlaylistContentModal from '@/components/playlist/ContentModal';
import PlaylistModal from '@/components/playlist/PlaylistModal';



const PlaylistPage = () => {
  const [myPlaylists, setMyPlaylists] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [playlistId, setPlaylistId] = useState('');
  const [playlistSearchValue, setPlaylistSearchValue] = useState('');
  const [videoSearchValue, setVideoSearchValue] = useState('');

  const toggleAddPlaylist = () => {
    setShowModal(s=>!s);
  };

  const handleChangeSearch = (value:string, id:string) =>{
    debouncedSetSearchTerm(value,id)
  }
  const debouncedSetSearchTerm = useCallback(
    debounce((value,id) => {
      if(id==="searchVideo"){
        setVideoSearchValue(value)
      }
      else{
        setPlaylistSearchValue(value)
        }
      }
      , 1000),
    []
  );

  return (
    <RootLayout>
      <PlaylistContentModal />
      <div className='flex w-full h-[90%] absolute justify-around gap-2 p-2'>
          <div className='flex flex-col h-full justify-between w-[40%]'>
            <div className='rounded-xl p-8 bg-zinc-900 h-full '>
            <div className='flex relative mb-5 text-white flex-row'>
            <div className='flex me-auto ml-2'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-6">
              <path d="M6 13.5V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m12-3V3.75m0 9.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 3.75V16.5m-6-9V3.75m0 3.75a1.5 1.5 0 0 1 0 3m0-3a1.5 1.5 0 0 0 0 3m0 9.75V10.5" />
            </svg>
            <span className='ml-5'>Your Library</span> 
            </div>
            
            <div className='block mr-8'>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className='h-full hover:rounded-full hover:bg-zinc-800' onClick={toggleAddPlaylist}>
            <path d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            </div>
            </div>
            <ToggleSwitch
              option1='My playlists'
              option2='Trending now'
              boolFlag = {myPlaylists}
              setBool={setMyPlaylists}
              />
            
            <div className='flex flex-col h-[90%] w-full mt-10'>
            <div className="relative w-full">
              <Input
                id="searchPlaylist"
                className="bg-zinc-800 rounded-2xl p-2 pl-10 text-gray-500 placeholder:text-gray-500 w-full focus-visible:ring-0 focus-visible:ring-black focus-visible:ring-offset-0 border-transparent"
                placeholder="Search playlist.."
                onChange={(e) => handleChangeSearch(e.target.value, e.target.id)}

              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="absolute left-3 top-2 w-6 h-6 text-gray-500">
              <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            
            <SidebarList
                myPlaylists={myPlaylists}
                playlistId={playlistId}
                setPlaylistId={setPlaylistId}
                playlistSearch={playlistSearchValue}
              />
            </div>
          </div>
        </div>
        <div className='rounded-xl p-8 w-[100%] bg-zinc-900 flex flex-col gap-6'>
          <div className="relative w-full">
              <Input
                id="searchVideo"
                className="bg-zinc-800 rounded-2xl p-2 pl-10 text-gray-500 placeholder:text-gray-500 w-full focus-visible:ring-0 focus-visible:ring-black focus-visible:ring-offset-0 border-transparent"
                placeholder="Search for content"
                onChange={(e) => handleChangeSearch(e.target.value,e.target.id)}
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="absolute left-3 top-2 w-6 h-6 text-gray-500">
              <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          
          <ContentList
          myPlaylists={myPlaylists}
          playlistId={playlistId}
          videoSearch={videoSearchValue}
          />
        </div>
      </div>
      {showModal && (
        <PlaylistModal
          onClose={toggleAddPlaylist}
        />
      )}
    </RootLayout>
  )
}


export default PlaylistPage