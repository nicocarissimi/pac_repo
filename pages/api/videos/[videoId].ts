import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    await serverAuth(req);

    const { videoId } = req.query;

    if (typeof videoId !== 'string') {
      throw new Error('Invalid Id');
    }

    if (!videoId) {
      throw new Error('Missing Id');
    }

    const videos = await prismadb.video.findUnique({
      where: {
        id: videoId
      }
    });

    return res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
