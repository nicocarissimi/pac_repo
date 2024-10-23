// pages/api/checkIfAuthorExists.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { title, author } = req.body;

  try {
    const existingRecord = await prismadb.video.findFirst({
      where: {
        AND: [
          { author: author },
          { title: title }
        ]
      }
    });

    if (existingRecord) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Errore durante la verifica nel database" });
  }
}
