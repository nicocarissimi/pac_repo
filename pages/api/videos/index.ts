import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
import serverAuth from "@/libs/serverAuth";
import { CategoryInterface } from "@/libs/definitions";



async function get(res: NextApiResponse) {
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

  return res.status(200).json(videosVideoInterface);
}

async function post(req: NextApiRequest, res: NextApiResponse) {
    const item = req.body.value

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
        return res.status(200).json(newVideo)
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
      
      return res.status(200).json(newVideo)


}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {

    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).end();
    }

    try {
      await serverAuth(req);
    } catch (error) {
      console.log(error)
    }

    if (req.method === 'POST') {
      return post(req, res)
    }

    if (req.method === 'GET' ) {
      return get(res)
    }

  } catch (error) {
    console.error({ error })
    return res.status(500).end();
  }
}
