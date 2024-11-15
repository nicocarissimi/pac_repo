import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";

import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req);

      const { videoId } = req.body;
  
      const existingVideo = await prismadb.video.findUnique({
        where: {
          id: videoId,
        }
      });
  
      if (!existingVideo) {
        throw new Error('Invalid ID');
      }
  
      const user = await prismadb.user.update({
        where: {
          email: currentUser.email || '',
        },
        data: {
          favoriteIds: {
            push: videoId
          }
        }
      });
  
      return res.status(200).json(user);
    }

    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth(req);

      const { videoId } = req.body;

      const existingVideo = await prismadb.video.findUnique({
        where: {
          id: videoId,
        }
      });

      if (!existingVideo) {
        throw new Error('Invalid ID');
      }

      const updatedFavoriteIds = without(currentUser.favoriteIds, videoId);

      const updatedUser = await prismadb.user.update({
        where: {
          email: currentUser.email || '',
        },
        data: {
          favoriteIds: updatedFavoriteIds,
        }
      });

      return res.status(200).json(updatedUser);
    }
    
    return res.status(405).end();
  } catch (error) {
    console.error(error);

    return res.status(500).end();
  }
}
