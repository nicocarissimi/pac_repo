import React, { useState } from 'react'
import RootLayout from '../components/layout'
import ContentList from '@/components/ContentList';
import ToggleSwitch from '@/components/ToggleSwitch';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import usePlaylist from '@/hooks/usePlaylist';
import { useSWRConfig } from 'swr';
import { ScrollArea } from "@/components/ui/scroll-area"
import PlaylistDisplay from '@/components/PlaylistDisplay';
import PlaylistModal from '@/components/PlaylistModal';



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
  const { data: userPlaylist = [] } = usePlaylist();
  const { data: hotPlaylist=[]} = usePlaylist(true);
  const [playlistName, setPlaylistName] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [myPlaylists, setMyPlaylists] = useState(true)
  const [showModal, setShowModal] = useState(false);

  const handleAddPlaylist = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <RootLayout>
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className='h-full hover:rounded-full hover:bg-zinc-800' onClick={handleAddPlaylist}>
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
              <input
                id="search"
                className="bg-zinc-800 rounded-2xl p-2 pl-10 text-gray-500 placeholder:text-gray-500 w-full"
                placeholder="search your father"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="absolute left-3 top-2 w-6 h-6 text-gray-500">
              <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
            <ScrollArea className=' mt-5 h-[90%]'>
            <PlaylistDisplay
                playlists={myPlaylists ? userPlaylist : hotPlaylist}
                myPlaylists={myPlaylists}
              />
              </ScrollArea>
            </div>
          </div>
        </div>
        <div className='rounded-xl p-8 w-[100%] bg-zinc-900 flex flex-col gap-6'>
          <div className="relative w-full">
              <input
                id="search"
                className="bg-zinc-800 rounded-2xl p-2 pl-10 text-gray-500 placeholder:text-gray-500 w-full"
                placeholder="search your father"
              />
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="absolute left-3 top-2 w-6 h-6 text-gray-500">
              <path d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </div>
          
          <ContentList />
        </div>
      </div>
      {showModal && (
        <PlaylistModal
          onClose={handleCloseModal}
        />
      )}
    </RootLayout>
  )
}


export default PlaylistPage