import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/libs/prismadb'; // Assuming you have Prisma set up
import serverAuth from '@/libs/serverAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {currentUser} = await serverAuth(req)

    // Switch statement to handle different HTTP methods
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);

      case 'POST':
        return await handlePost(req, res);

      case 'DELETE':
        return await handleDelete(req, res, currentUser.id);

      case 'PUT':
        return await handlePut(req, res, currentUser.id);

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE', 'PUT']);
        return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  }

// Handle GET request
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { playlistId, search } = req.query;
    let playlist;

    if (playlistId && playlistId !== '1') {
      playlist = await prismadb.playlist.findUnique({
        where: { id: playlistId as string },
      });
    }

    if (!playlist) {
      playlist = await prismadb.playlist.findFirst({
        where: { isPublic: true },
      });
    }

    if (!playlist) {
      return res.status(404).json({ error: 'No playlist found' });
    }

    const videos = await prismadb.videosInPlaylists.findMany({
      where: {
        playlistId: playlist.id,
        video: {
          title: search ? {
            contains: String(search),
            mode: 'insensitive',
          } : {},
        },
      },
      include: { video: true },
    });

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
    console.error('Error fetching playlist:', error);
    return res.status(500).end();
  }
}

// Handle POST request -> add one or more videos to a specific playlist
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { playlistId } = req.query;
  const { videoIds, videoRefresh} = req.body;
  if(videoRefresh){
    await prismadb.videosInPlaylists.deleteMany({
      where: {
        playlistId: playlistId as string
      },
    });
  }
  try {
    const existingEntry = await prismadb.videosInPlaylists.findFirst({
      where: {
        playlistId: playlistId as string,
        videoId: {
          in: videoIds
        }
      },
    });

    if (existingEntry) {
      return res.status(409).json({ message: 'Video is already in the playlist' });
    }

    const videoInPlaylist = await prismadb.videosInPlaylists.createMany({
      data: videoIds.map((id: string) => ({
        videoId: id as string,
        playlistId: playlistId as string,
      })),
    });

    return res.status(201).json(videoInPlaylist);

  } catch (error) {
    console.error('Error adding video to playlist:', error);
    return res.status(500).json({ error: 'Failed to add video to playlist' });
  }
}

// Handle DELETE request
async function handleDelete(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { playlistId } = req.query;
  const { videoId } = req.body;

  try {
    const playlist = await prismadb.playlist.findUnique({
      where: { id: playlistId as string },
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to delete this playlist' });
    }

    if (videoId) {
      await prismadb.videosInPlaylists.deleteMany({
        where: {
          playlistId: playlistId as string,
          videoId: videoId as string,
        },
      });
      return res.status(200).json({ message: 'Video deleted successfully' });
    }

    await prismadb.playlist.delete({
      where: { id: playlistId as string },
    });

    return res.status(200).json({ message: 'Playlist deleted successfully' });

  } catch (error) {
    console.error('Error deleting playlist or video:', error);
    return res.status(500).json({ error: 'Failed to delete playlist or video' });
  }
}

// Handle PUT request -> edit playlist
async function handlePut(req: NextApiRequest, res: NextApiResponse, userId: string) {
  const { playlistId } = req.query;
  const { name, isPublic } = req.body;

  try {
    const playlist = await prismadb.playlist.findUnique({
      where: { id: playlistId as string },
    });

    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }

    if (playlist.userId !== userId) {
      return res.status(403).json({ error: 'You do not have permission to edit this playlist' });
    }

    const updatedPlaylist = await prismadb.playlist.update({
      where: { id: playlistId as string },
      data: {
        name: name || playlist.name,
        isPublic: typeof isPublic === 'boolean' ? isPublic : playlist.isPublic,
      },
    });

    return res.status(200).json(updatedPlaylist);

  } catch (error) {
    console.error('Error updating playlist:', error);
    return res.status(500).json({ error: 'Failed to update playlist' });
  }
}
