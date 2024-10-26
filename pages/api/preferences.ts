import { NextApiRequest, NextApiResponse } from 'next';
import serverAuth from '@/libs/serverAuth';
import prismadb from '@/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { currentUser } = await serverAuth(req);
        
        switch (req.method) {
            case 'GET':
                await getPreferences(res, currentUser.id);
                break;
            case 'POST':
                await addPreferences(req, res, currentUser.id);
                break;
            default:
                res.status(405).json({ error: 'Method not allowed' });
                break;
        }
    } catch (error) {
        console.log("Error trying to add preferences to the account", error)
    }
}

async function getPreferences(
    res: NextApiResponse,
    currentUserId: string
) {
    const learning_time_obj = await prismadb.user.findUnique({
        where:{
            id: currentUserId
        },
        select:{
            learning_time: true
        }
    })
    const categoryofInterest = await prismadb.usersInCategories.findMany({
        where:{
            userId:currentUserId
        },
        select:{
            categoryId:true
        }
    })
    const preferences = {
        learning_time: learning_time_obj?.learning_time,
        categories: categoryofInterest?.map(cateObj=> cateObj.categoryId)
    }
    return res.status(200).json(preferences);
}

async function addPreferences(
    req: NextApiRequest, 
    res: NextApiResponse,
    currentUserId: string
) {
    const {learning_time, categories} = (req.body)
    console.log(categories)
    console.log(req.body)
    const user = await prismadb.user.update({
        where:{
            id: currentUserId
        },
        data:{
            learning_time: learning_time
        }
    })

    const userOldCategory = await prismadb.usersInCategories.deleteMany({
        where:{
            userId: currentUserId
        }
    })


    const fetchSelectedCategories = async() => { 
        const categories_id = await prismadb.category.findMany({
          where: {
            name: {
              in: categories.map((catName: string)=> catName)
            }
          },
          select:{
            id: true
          }
        })
        return categories_id
      }
  
      const categories_id = await fetchSelectedCategories()
      const usersInCategories = await prismadb.usersInCategories.createMany({
        data: categories_id.map((category) => ({
            categoryId: category.id as string,
            userId: currentUserId as string,
          })),
      })
      return res.status(200).json(usersInCategories);
}