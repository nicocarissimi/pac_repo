import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).end();
    }
    try {
      await serverAuth(req);
    } catch (error) {
      console.log(error)
    }
    const movies = await prismadb.video.findMany();
    return res.status(200).json(movies);
  } catch (error) {
    console.error({ error })
    return res.status(500).end();
  }
}
