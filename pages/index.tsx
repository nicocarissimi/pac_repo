import React, { useEffect, useRef, useState } from 'react';

import Billboard from '@/components/Billboard';
import VideoList from '@/components/VideoList';
import InfoModal from '@/components/InfoModal';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import RootLayout from '../components/layout';
import useVideo from '@/hooks/useVideo';
import PlaylistContentModal from '@/components/playlist/ContentModal';
import useCategories from '@/hooks/useCategories';
import { CategoryInterface, Role, VideoInterface } from '@/libs/definitions';
import useSuggestedVideo from '@/hooks/useSuggestedVideo';
import useCurrentUser from '@/hooks/useCurrentUser';
import useSearchVideo from '@/hooks/useSearchVideo';

const Home = () => {
  const { data: videos = [] } = useVideo();
  const {isOpen, closeModal} = useInfoModalStore();
  const { data: categories=[]} = useCategories();
  const { data: suggestedVideo} = useSuggestedVideo()
  const targetRef = useRef<HTMLDivElement>(null);
  const { data: user } = useCurrentUser()
  const { searchValue } = useSearchVideo()
  const [filteredVideo, setFilteredVideo] = useState<VideoInterface[]>([])


  useEffect(()=> {
    if(searchValue && searchValue?.length > 0){
      const filteredVideo = videos.filter((video: VideoInterface)=> video.title.toLowerCase().includes(searchValue))
      setFilteredVideo(filteredVideo)
    }
  },[searchValue])

  return (
    <RootLayout search={true}>
        <InfoModal visible={isOpen} onClose={closeModal} />
        <PlaylistContentModal />
        <Billboard />
        <div ref={targetRef} className="pb-40">
          {searchValue ? <VideoList title={"Search Result"} data={filteredVideo} />: 
          <>
            { user?.role !== Role.ADMIN &&
              <VideoList title="Suggested Video" data={suggestedVideo} />
            }
            { categories.map((category: CategoryInterface) => {
              const selectedVideo = videos.filter((video: VideoInterface) => video.categories.map((c) => c.name).includes(category.name))
              return <VideoList key={category.name} title={category.name} data={selectedVideo} />
            }) }
          </>
          }
         
        </div>
    </RootLayout>
  )
}

export default Home;
