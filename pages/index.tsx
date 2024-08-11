import React, { useRef, useState } from 'react';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard';
import MovieList from '@/components/MovieList';
import InfoModal from '@/components/InfoModal';
import useMovieList from '@/hooks/useMovieList';
import useFavorites from '@/hooks/useFavorites';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import RootLayout from '../components/layout';

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
  const { data: movies = [] } = useMovieList();
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
    <RootLayout onChangeValue = {handleChangeValue}>
        <InfoModal visible={isOpen} onClose={closeModal} />
        <Billboard />
        <div ref={targetRef} className="pb-40">
          <MovieList title="Trending Now" data={movies} />
          <MovieList title="My List" data={favorites} />
        </div>
    </RootLayout>
  )
}

export default Home;
