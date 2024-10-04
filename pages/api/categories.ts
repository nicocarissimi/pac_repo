import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "@/libs/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'GET') {
          return res.status(405).end();
        }    
        const categories = await prismadb.category.findMany();
        return res.status(200).json(categories);
      } catch (error) {
        console.error(error);
        return res.status(500).end();
      }
}
