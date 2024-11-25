import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET' && req.method !== 'POST') {
          return res.status(405).end();
        }

        if (req.method === 'POST') {
          const item = req.body.value
          await prismadb.category.create({
            data: {
              name: item
            }
          })
          return res.status(200).json(item)
        }

        const categories = await prismadb.category.findMany();
        return res.status(200).json(categories);
      } catch (error) {
        console.error(error);
        return res.status(500).end();
      }
}
