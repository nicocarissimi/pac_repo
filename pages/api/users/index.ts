import { UserRoleEnum } from "@/libs/definitions";
import serverAuth from "@/libs/serverAuth";
import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/libs/prismadb';



async function GET() {
    const users = await prismadb.user.findMany()
    return users
}

async function POST(userId: string) {
    const updateUser = await prismadb.user.update({
        where: { id: userId },
        data: {role: UserRoleEnum.ADMIN}
    })
    return updateUser
}

async function DELETE(userId: string) {
    const removedUser = await prismadb.user.delete({
        where: {id : userId}
    })
    return removedUser
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const { currentUser } = await serverAuth(req);

    if (!currentUser) {
        throw new Error('Not signed in');
    }

    switch (req.method) {
        case 'GET': 
            const users = await GET()
            return res.status(200).json(users)
        case 'POST': 
            const { id } = req.body;
            const updateUser = await POST(id)
            return res.status(201).json(updateUser);
        case 'DELETE': 
            const { userId } = req.body
            const removedUser = await DELETE(userId)
            return res.status(200).json(removedUser)
        default: return res.status(405).end();
    }
}