import React, { useRef, useState } from 'react';

import Billboard from '@/components/Billboard';
import VideoList from '@/components/VideoList';
import InfoModal from '@/components/InfoModal';
import useFavorites from '@/hooks/useFavorites';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import RootLayout from '../components/layout';
import useVideo from '@/hooks/useVideo';
import PlaylistContentModal from '@/components/playlist/ContentModal';
import useCategories from '@/hooks/useCategories';
import { CategoryInterface, Role, VideoInterface } from '@/libs/definitions';
import useSuggestedVideo from '@/hooks/useSuggestedVideo';
import useCurrentUser from '@/hooks/useCurrentUser';

const Home = () => {
  const { data: videos = [] } = useVideo();
  const { data: favorites = [] } = useFavorites();
  const {isOpen, closeModal} = useInfoModalStore();
  const { data: categories=[]} = useCategories();
  const { data: suggestedVideo} = useSuggestedVideo()
  const targetRef = useRef<HTMLDivElement>(null);
  const { data: user } = useCurrentUser()

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
        <PlaylistContentModal />
        <Billboard />
        <div ref={targetRef} className="pb-40">
          { user?.role !== Role.ADMIN &&
            <VideoList title="Suggested Video" data={suggestedVideo} />
          }
          <VideoList title="My List" data={favorites} />
          { categories.map((category: CategoryInterface) => {
            const selectedVideo = videos.filter((video: VideoInterface) => video.categories.map((c) => c.name).includes(category.name))
            return <VideoList key={category.name} title={category.name} data={selectedVideo} />
          }) }
        </div>
    </RootLayout>
  )
}

export default Home;
