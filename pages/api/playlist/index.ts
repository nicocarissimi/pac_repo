import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/libs/prismadb';
import serverAuth from '@/libs/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    if (req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'GET') {  
        return res.status(405).end();
    }
    const { currentUser } = await serverAuth(req);
    if (req.method === 'GET') {
      const searchValue = req.query.search
      const infoVideo = Boolean(req.query.infoVideo)
      if(!req.query.hot){
        // Video is already in the user's playlist
        if(req.query.videoId){
          const playlist = await prismadb.playlist.findMany({
            where: {
              name: searchValue? {contains: String(searchValue)} : {},
              userId: currentUser.id,
              videos: {
                none:{
                  videoId: req.query.videoId as string
                }
              }
            }
          });
          return res.status(200).json(playlist);
        }
        else{
          const playlist = await prismadb.playlist.findMany({
            where: {
              name: searchValue? {contains: String(searchValue), mode: 'insensitive'} : {},
              userId: currentUser.id
            },
            include: {
              videos: {
                include: {
                  video: {
                    select: {
                      thumbnailUrl: true
                    }
                  }
                }
              }
            }
          });
          const response = playlist.map(({videos, ...rest}) => ({...rest,  thumbnailUrl: videos[0].video.thumbnailUrl}))
          return res.status(200).json(response);
        }
      }
      else{
        const playlists = await prismadb.playlist.findMany({
          where: {
            name: searchValue? {contains: String(searchValue), mode: 'insensitive'} : {},
            isPublic : true
          },
          include: {
            videos: {
              include: {
                video: {
                  select:
                    infoVideo ? {thumbnailUrl: true, title: true}: { thumbnailUrl: true },
                  }
                }
              }
            }
          }
        );
        console.log(infoVideo)
        console.log(playlists.map(playlist => playlist.videos.map(video => video.video)))
        let response = playlists.map(({videos, ...rest}) => {
          return infoVideo ?  
          {...rest,  thumbnailUrl: videos[0].video.thumbnailUrl, videos_title: videos.map(video=>video.video.title)} :
          {...rest,  thumbnailUrl: videos[0].video.thumbnailUrl}  
        })
        return res.status(200).json(response);
      }
    }
    const {Playlist} = req.body;
    if (!currentUser) {
      throw new Error('Not signed in');
    }
    try{
    if (!Playlist.id) {
    const newPlaylist = await prismadb.playlist.create({
      data: {
        name: Playlist.name,
        userId: currentUser.id,
        isPublic: Playlist.isPublic
      },
    });
    res.status(201).json(newPlaylist);
    }
    else if (req.method === 'PUT') {
      const newPlaylist = await prismadb.playlist.update({
        where: { id: Playlist.id },
        data: { name: Playlist.name, userId: currentUser.id, isPublic: Playlist.isPublic },
      });
      res.status(201).json(newPlaylist);
    }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating or updating playlist' });
  }
  } catch(error){
    console.log(error);
    return res.status(500).end();
  }
}