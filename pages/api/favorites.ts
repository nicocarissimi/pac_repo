import { NextApiRequest, NextApiResponse } from "next";

import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    const { currentUser } = await serverAuth(req);

    const favoritedVideos = await prismadb.video.findMany({
      where: {
        id: {
          in: currentUser?.favoriteIds,
        }
      }
    });

    return res.status(200).json(favoritedVideos);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
