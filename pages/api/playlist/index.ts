import { NextApiRequest, NextApiResponse } from 'next';
import { getPlaylist } from './getPlaylist';
import { createPlaylist } from './createPlaylist';
import { updatePlaylist } from './updatePlaylist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        await getPlaylist(req, res);
        break;
      case 'POST':
        await createPlaylist(req, res);
        break;
      case 'PUT':
        await updatePlaylist(req, res);
        break;
      default:
        res.status(405).json({ error: 'Method not allowed' });
        break;
    }
  } catch (error) {
    console.error(error);
    return res.status(500).end();
  }
}
