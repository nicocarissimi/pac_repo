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
      const { currentUser } = await serverAuth(req);
      const playlist = await prismadb.playlist.findMany({
        where: {
          isPublic : true
        }
      });
      return res.status(200).json(playlist);
    }

  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}