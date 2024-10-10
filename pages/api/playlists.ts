import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }
    if(!req.query.hot){
    const { currentUser } = await serverAuth(req);
    const playlist = await prismadb.playlist.findMany({
      where: {
        userId: currentUser.id
      }
    });

    return res.status(200).json(playlist);
    }
    else{
      const playlists = await prismadb.playlist.findMany({
        where: {
          isPublic : true
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
      const response = playlists.map(({videos, ...rest}) => ({...rest,  thumbnailUrl: videos[0].video.thumbnailUrl}))
      return res.status(200).json(response);
    }

  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}