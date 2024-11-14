import { NextApiRequest, NextApiResponse } from 'next';
import serverAuth from '@/libs/serverAuth';
import prismadb from '@/libs/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { currentUser } = await serverAuth(req);
    switch (req.method) {
      case 'GET':
        await getPlaylist(req, res, currentUser.id);
        break;
      case 'POST':
        await createPlaylist(req, res, currentUser.id);
        break;
      case 'PUT':
        await updatePlaylist(req, res, currentUser.id);
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

async function getPlaylist(
  req: NextApiRequest, 
  res: NextApiResponse, 
  currentUserId:string) {
  try {
    const searchValue = req.query.search ? String(req.query.search) : undefined;
    const infoVideo = req.query.infoVideo === "true";
    const isHot = req.query.hot === "true";
    const videoId = req.query.videoId ? String(req.query.videoId) : undefined;

    // Build common query conditions for all cases
    const queryConditions: any = {
      name: searchValue ? { contains: searchValue, mode: 'insensitive' } : undefined,
    };


    // fetch only user playlist
    if (!isHot) {
      queryConditions.userId = currentUserId;
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
                select: {
                  thumbnailUrl: true,
                  title: infoVideo,
                  videoUrl: infoVideo
                },
              },
            },
          },
        },
      });

      // Map response to include thumbnailUrl from the first video
      const response = playlists.map(({ videos, ...rest }) => {
        const p: any = ({...rest,
        thumbnailUrl: videos[0]?.video.thumbnailUrl})
        if(infoVideo){
          p.videos = videos.map(video => ({title: video.video.title, videoUrl: video.video.videoUrl}))
        }
        return p
      });

      return res.status(200).json(response);


    } else {
      // Handle public playlists (hot flag is set)
      queryConditions.isPublic = true;
      queryConditions.videos = {
        some : {}
      }

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
      const response = playlists.map(({ videos, ...rest }) => {
        const p: any = ({...rest,
        thumbnailUrl: videos[0]?.video.thumbnailUrl})
        return p
      });

      return res.status(200).json(response);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error fetching playlist' });
  }
}

async function createPlaylist(
  req: NextApiRequest, 
  res: NextApiResponse,
  currentUserId:string
) {
  try {
    const { playlist } = req.body;
    const newPlaylist = await prismadb.playlist.create({
      data: {
        name: playlist.name,
        userId: currentUserId,
        isPublic: playlist.isPublic,
      },
    });

    return res.status(201).json(newPlaylist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error creating playlist' });
  }
}

async function updatePlaylist(
  req: NextApiRequest, 
  res: NextApiResponse,
  currentUserId: string
) {
  try {
    
    const { playlist } = req.body;
    const updatedPlaylist = await prismadb.playlist.update({
      where: { id: playlist.id },
      data: {
        name: playlist.name,
        userId: currentUserId,
        isPublic: playlist.isPublic,
      },
    });

    return res.status(200).json(updatedPlaylist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error updating playlist' });
  }
}
