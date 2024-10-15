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

    if (req.method === 'GET') {
      try {
        const { playlistId,search } = req.query;
        console.log(search)
        let playlist;

        // If playlistId exists in the query, find that playlist
        if (playlistId) {
          playlist = await prismadb.playlist.findUnique({
            where: {
              id: playlistId as string,  // Ensure playlistId is used as a string
            },
          });
          }

          // If no playlist with the given ID get first public playlist
          if (!playlist) {
            playlist = await prismadb.playlist.findFirst({
              where: {
                isPublic: true,
              },
            });
            }

            if (!playlist) {
              return res.status(404).json({ error: 'No playlist found' });
            }

            const videos = await prismadb.videosInPlaylists.findMany({
              where: {
                playlistId: playlist.id,
                video:{
                    title: search?{
                      contains: String(search),
                      mode: 'insensitive'
                    }:{},
                }
              },
              include: {
                video: true,  // Assuming the relation to the 'videos' table is named 'video'
              },
            });

            if (videos.length === 0) {
              return res.status(404).json({ error: 'No videos found in this playlist' });
            }
        
            // Map and extract video details such as thumbnailUrl, duration, etc.
            const videoDetails = videos.map((item) => ({
              id: item.video.id,
              title: item.video.title,
              thumbnailUrl: item.video.thumbnailUrl,
              duration: item.video.duration,
              description: item.video.description,
              videoUrl: item.video.videoUrl,
            }));
        
            return res.status(200).json(videoDetails);
        
          } catch (error) {
        console.error(error);
        return res.status(500).end();
      }
    }

    // Handle POST
    if (req.method === 'POST') {
      const { playlistId } = req.query;
      const { videoId } = req.body;
      // Check if new
      const existingEntry = await prismadb.videosInPlaylists.findFirst({
        where: {
          playlistId: playlistId as string,
          videoId: videoId as string,
        },
      });

      if (existingEntry) {
        return res.status(409).json({ message: 'Video is already in the playlist' });
      }

      // Create new record video-playlist
      const videoInPlaylist = await prismadb.videosInPlaylists.create({
        data: {
          playlistId: playlistId as string,
          videoId: videoId as string,
        },
      });
      return res.status(201).json(videoInPlaylist);
    }

    // Handle DELETE
    if (req.method === 'DELETE') {
      const { playlistId } = req.query;
      const { videoId } = req.body;
      console.log(videoId)
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
      if(videoId) {
        await prismadb.videosInPlaylists.deleteMany({
          where: {
            playlistId: playlistId as string,
            videoId: videoId as string,
          },
        })
        return res.status(200).json({ message: 'Video deleted successfully' });
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
