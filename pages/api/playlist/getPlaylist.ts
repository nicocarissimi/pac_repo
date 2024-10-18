import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/libs/prismadb';
import serverAuth from '@/libs/serverAuth';

export async function getPlaylist(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { currentUser } = await serverAuth(req);
    const searchValue = req.query.search ? String(req.query.search) : undefined;
    const infoVideo = Boolean(req.query.infoVideo);
    const isHot = Boolean(req.query.hot);
    const videoId = req.query.videoId ? String(req.query.videoId) : undefined;

    // Build common query conditions for all cases
    const queryConditions: any = {
      name: searchValue ? { contains: searchValue, mode: 'insensitive' } : undefined,
    };


    // fetch only user playlist
    if (!isHot) {
      queryConditions.userId = currentUser.id;
      if (videoId) {
        // Fetch playlist that do not have the video provided as parameter => components/playlist/AddVideoPlaylist.tsx
        queryConditions.videos = {
          none: { videoId },
        };
      }

      const playlists = await prismadb.playlist.findMany({
        where: queryConditions,
        include: {
          videos: {
            include: {
              video: {
                select: { thumbnailUrl: true },
              },
            },
          },
        },
      });

      // Map response to include thumbnailUrl from the first video
      const response = playlists.map(({ videos, ...rest }) => ({
        ...rest,
        thumbnailUrl: videos[0]?.video.thumbnailUrl,
      }));

      return res.status(200).json(response);
    } else {
      // Handle public playlists (hot flag is set)
      queryConditions.isPublic = true;

      const playlists = await prismadb.playlist.findMany({
        where: queryConditions,
        include: {
          videos: {
            include: {
              video: {
                select: infoVideo
                  ? { thumbnailUrl: true, title: true }
                  : { thumbnailUrl: true },
              },
            },
          },
        },
      });

      // Map response to include thumbnailUrl and optionally title
      const response = playlists.map(({ videos, ...rest }) => ({
        ...rest,
        thumbnailUrl: videos[0]?.video.thumbnailUrl,
        ...(infoVideo && { title: videos[0]?.video.title }),
      }));

      return res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching playlist' });
  }
}
