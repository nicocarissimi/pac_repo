import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";


async function GET(videoId: string) {
  const videos = await prismadb.video.findUnique({
    where: {
      id: videoId
    }
  });
  return videos
}

async function DELETE(videoId: string){
  const removedVideo = await prismadb.video.delete({where:{id: videoId}})
  return removedVideo
}




export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await serverAuth(req);

  switch (req.method) {
    case 'GET': 
        const { videoId: id } = req.query
        const users = await GET(id as string)
        return res.status(200).json(users)
    case 'DELETE': 
        const { videoId } = req.query
        const removedVideo = await DELETE(videoId as string)
        return res.status(200).json(removedVideo)
    default: return res.status(405).end();
}
}
