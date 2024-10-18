import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/libs/prismadb';
import serverAuth from '@/libs/serverAuth';

export async function updatePlaylist(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { currentUser } = await serverAuth(req);
    const { Playlist } = req.body;

    if (!currentUser) {
      throw new Error('Not signed in');
    }

    const updatedPlaylist = await prismadb.playlist.update({
      where: { id: Playlist.id },
      data: {
        name: Playlist.name,
        userId: currentUser.id,
        isPublic: Playlist.isPublic,
      },
    });

    return res.status(200).json(updatedPlaylist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error updating playlist' });
  }
}
