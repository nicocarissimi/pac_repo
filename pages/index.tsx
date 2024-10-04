import React, { useRef, useState } from 'react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

import Billboard from '@/components/Billboard';
import VideoList from '@/components/VideoList';
import InfoModal from '@/components/InfoModal';
import useFavorites from '@/hooks/useFavorites';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import RootLayout from '../components/layout';
import useVideo from '@/hooks/useVideo';
import VideoModal from '@/components/VideoModal';

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

const Home = () => {
  const { data: videos = [] } = useVideo();
  const { data: favorites = [] } = useFavorites();
  const {isOpen, closeModal} = useInfoModalStore();
  const targetRef = useRef<HTMLDivElement>(null);

  const [searchValue, setSearchValue] = useState<string>();

  const handleChangeValue = (value: string) => {
    if(targetRef.current){
      (targetRef.current as HTMLDivElement).scrollIntoView({behavior: 'smooth'});
    }      
    setSearchValue(value)
  }

  return (
    <RootLayout>
        <InfoModal visible={isOpen} onClose={closeModal} />
        <Billboard />
        <div ref={targetRef} className="pb-40">
          <VideoList title="Trending Now" data={videos} />
          <VideoList title="My List" data={favorites} />
        </div>
    </RootLayout>
  )
}

export default Home;
