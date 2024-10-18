import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/libs/prismadb';
import { Role } from '@/libs/definitions';
import fs from 'fs'
import path from 'path';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { email, name, password } = req.body;

    const existingUser = await prismadb.user.findUnique({
      where: {
        email
      }
    })

    if (existingUser) {
      return res.status(422).json({ error: 'Email taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const imageStaticPath = '/images/user/';
    const imageDir = path.join(process.cwd(), 'public', 'images', 'user');
    const images = fs.readdirSync(imageDir);

    const imgSrc = images[Math.floor(Math.random() * images.length)];


    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image: imageStaticPath + imgSrc,
        role: Role.USER
      }
    })

    return res.status(200).json(user);
  } catch (error) {
    return res.status(400).json({ error: `Something went wrong: ${error}` });
  }
}