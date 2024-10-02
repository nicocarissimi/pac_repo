import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/libs/prismadb';

import { getSession } from "next-auth/react";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    if (req.method !== 'POST' && req.method !== 'PUT') {  
        return res.status(405).end();
    }
    const session = await getSession({ req });
    console.log(req.body);
    const {Playlist} = req.body;
    if (!session?.user?.email) {
      throw new Error('Not signed in');
    }
    const user = await prismadb.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      throw new Error('Invalid email');
    }
    if (!Playlist.id) {
    console.log('No ID provided');
    }
    try {
      const newPlaylist = await prismadb.playlist.upsert({
        where: { id: Playlist.id },
        update: { name: Playlist.name, userId: user.id, isPublic: Playlist.isPublic },
        create: { name: Playlist.name, userId: user.id, isPublic: Playlist.isPublic },
      });
      res.status(201).json(newPlaylist);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error creating playlist' });
  }
  } catch(error){
    console.log(error);
    return res.status(500).end();
  }
}