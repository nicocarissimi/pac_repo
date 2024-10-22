import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";
import { CategoryInterface, VideoInterface } from "@/libs/definitions";



async function GET() {
  const videos = await prismadb.video.findMany({
    include: {
      categories: {
        select: {
          category: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });
  const videosVideoInterface = videos.map(video => ({
      ...video,
      duration: video.duration.toString(),
      categories: video.categories.map(item => ({name: item.category.name}))
  }))

  return videosVideoInterface
}

async function POST(item: VideoInterface) {

    const existingVideo = await prismadb.video.findFirst({ where: { videoUrl: item.videoUrl}, select: {categories: { select: { category: true}}}})

    
    const fetchSelectedCategories = async() => { 
      const categories = await prismadb.category.findMany({
        where: {
          name: {
            in: item.categories.map((category: {name: string})  => category.name)
          }
        }
      })
      return categories
    }

    const selectedCategories = await fetchSelectedCategories()

    if (existingVideo) {
        const oldCategories = existingVideo.categories

        const categoriesToRemove = oldCategories.filter((c) => 
          !selectedCategories.map(item=>item.id).includes(c.category.id)
        ).map(item => item.category)


        const categoriesToAdd = selectedCategories.filter((c) => 
          !oldCategories.map(item => item.category.name).includes(c.name)
        )

        var newVideo = await prismadb.video.update({
          where: { videoUrl: item.videoUrl },
          data: {
            title: item.title,
            description: item.description,
            thumbnailUrl: item.thumbnailUrl,
            videoUrl: item.videoUrl,
            categories: {
              create: categoriesToAdd.map(c => ({category:{ connect:{ id: c.id }}})),
              deleteMany: categoriesToRemove.map(item => ({ categoryId: item.id }))
            },
            duration: item.duration
          }
        })     
        return newVideo
    }
      const categoryIds = async() => {
        return selectedCategories.map((category: CategoryInterface) => ({
        category: {
          connect: {
            name: category.name,
          },
        },
      }))
      }
      
      var newVideo = await prismadb.video.create({
        data: {
          title: item.title,
          description: item.description,
          videoUrl: item.videoUrl,
          thumbnailUrl: item.thumbnailUrl,
          categories: {
            create: await categoryIds()
          },
          duration: item.duration
        }
      })  
      
      return newVideo


}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await serverAuth(req)

  switch (req.method) {
    case 'GET': 
        const users = await GET()
        return res.status(200).json(users)
    case 'POST': 
        const { value } = req.body;
        const updateVideo = await POST(value)
        return res.status(201).json(updateVideo);
    default: return res.status(405).end();
}

}
