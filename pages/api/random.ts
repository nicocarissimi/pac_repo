import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }

    await serverAuth(req);

    const videosCount = await prismadb.video.count();
    const randomIndex = Math.floor(Math.random() * videosCount);

    const randomVideos = await prismadb.video.findMany({
      take: 1,
      skip: randomIndex
    });

    return res.status(200).json(randomVideos[0]);
  } catch (error) {
    console.log(error);

    return res.status(500).end();
  }
}
