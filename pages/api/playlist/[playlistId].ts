import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prismadb from '@/libs/prismadb'; // Assuming you have Prisma set up

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    // Get the session information (user authentication)
    const session = await getSession({ req });

    // Extract playlistId from query params
    const { playlistId } = req.query;
    console.log(`Deleting playlist with ID: ${playlistId}`);
    // Check if user is authenticated
    if (!session?.user?.email) {
      return res.status(401).json({ error: 'Not signed in' });
    }

    try {
      // Fetch the user by email
      const user = await prismadb.user.findUnique({
        where: { email: session.user.email },
      });

      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }

      // Find the playlist by ID
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

      // Delete the playlist if it belongs to the user
      await prismadb.playlist.delete({
        where: { id: playlistId as string },
      });

      // Send success response
      return res.status(200).json({ message: 'Playlist deleted successfully' });

    } catch (error) {
      console.error('Error deleting playlist:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }
}