import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import Image from 'next/image'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { MoreHorizontal } from 'lucide-react'
import useUsers from '@/hooks/useUsers'
import { UserInterface, UserRoleEnum } from '@/libs/definitions'
import axios from 'axios'

export default function UsersTab() {

    const { data: users=[], mutate } = useUsers()
    const [usersList, setUsersList] = useState(users)

    useEffect(() => {
      // Check if the new playlists are different before setting state
      if (JSON.stringify(users) !== JSON.stringify(usersList)) {
          setUsersList(users);
      }
    }, [users]); 

    const handleInputSearch = (item: React.ChangeEvent<HTMLInputElement>) => {
        setUsersList(users.filter((user: UserInterface) => 
        user.name.toLowerCase().includes(item.target.value.toLowerCase())))
    }

    const handlePromotion = async(id: string) => {
      await axios.post('/api/users', {id})
      mutate()
    }

    const handleDelete = async(id: string) => {
      await axios.delete('/api/users', {data: {id}})
      mutate()
    }



    return (
        <>
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Manage all contents within action sphere
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input placeholder='Search content...' className='mb-2 ' onChange={handleInputSearch} />
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">Image</span>
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Updated At</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                { usersList.map((user: UserInterface) => (
                  <TableRow key={user.id}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Product image"
                      className="aspect-square rounded-md object-cover bg-gray-400"
                      height="100"
                      src={user.image}
                      width="100"
                    />
                  </TableCell> 
                  <TableCell className="font-semibold">
                    <span>{user.name}</span>
                  </TableCell>
                  <TableCell className="font-medium">
                    <span> {new Date(user.createdAt).toDateString()}</span>
                  </TableCell>
                  <TableCell className="font-medium w-80">
                    <span>{new Date(user.updatedAt).toDateString()}</span>
                  </TableCell>
                  <TableCell className="font-medium w-80">
                    {user.role}                          
                  </TableCell>
                  <TableCell>
                  {user.role !== UserRoleEnum.ADMIN &&
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handlePromotion(user.id)}>Promote to admin</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(user.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                  </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-{users.length < 10 ? users.length : '10'}</strong> of <strong>{users.length}</strong>{" "}
            users
          </div>
          </CardFooter>
        </Card>
    </>
    )
}
