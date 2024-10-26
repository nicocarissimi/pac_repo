import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";


async function getIds(videoUrlList: string[]) {
    const videoIds = await prismadb.video.findMany({
      select: {
        id: true
      },
      where:{
        videoUrl: {
          in: videoUrlList
        }
      }
    })
    return videoIds
  }




export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    await serverAuth(req)
  
    switch (req.method) {
      case 'POST': 
          const { videoUrl } = req.body;
          const ids = await getIds(videoUrl)
          return res.status(201).json(ids);
      default: return res.status(405).end();
  }
  
  }
  