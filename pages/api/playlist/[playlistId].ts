import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prismadb from '@/libs/prismadb'; // Assuming you have Prisma set up

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });

  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Not signed in' });
  }

  try {
    // Fetch user
    const user = await prismadb.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Handle DELETE
    if (req.method === 'DELETE') {
      const { playlistId } = req.query;
      const playlist = await prismadb.playlist.findUnique({
        where: { id: playlistId as string },
      });

      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }

      // Check if the playlist belongs to the user
      if (playlist.userId !== user.id) {
        return res.status(403).json({ error: 'You do not have permission to delete this playlist' });
      }
      await prismadb.playlist.delete({
        where: { id: playlistId as string },
      });

      return res.status(200).json({ message: 'Playlist deleted successfully' });
    }

    // Handle PUT
    if (req.method === 'PUT') {
      const { playlistId } = req.query;
      const { name, isPublic } = req.body;
      const playlist = await prismadb.playlist.findUnique({
        where: { id: playlistId as string },
      });

      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }
      if (playlist.userId !== user.id) {
        return res.status(403).json({ error: 'You do not have permission to edit this playlist' });
      }
      // Update
      const updatedPlaylist = await prismadb.playlist.update({
        where: { id: playlistId as string },
        data: {
          name: name || playlist.name, // If name is provided, update it; otherwise, keep the old name
          isPublic: typeof isPublic === 'boolean' ? isPublic : playlist.isPublic, // Update if isPublic is provided
        },
      });

      return res.status(200).json(updatedPlaylist);
    }

    //method not allowed
    res.setHeader('Allow', ['DELETE', 'PUT']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });

  } catch (error) {
    console.error('Error handling playlist:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
