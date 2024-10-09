import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react'
import RootLayout from '@/components/layout';
import Image from "next/image"
  import {
    MoreHorizontal,
    PlusCircle,
  } from "lucide-react"
  import { Button } from "@/components/ui/button"
  import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import useVideo from '@/hooks/useVideo';
import { VideoInterface } from '@/libs/definitions';
import VideoModal from '@/components/VideoModal';
import useCreateEditDialog from '@/hooks/useCreateEditDialog';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);
    if (!session) {
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        }
      }
    }
  
    return {
      props: {}
    }
  } 
    

  export default function AdminDashboard() {
      const { openModal } = useCreateEditDialog();  
      const { data: videos=[], mutate } = useVideo()

      const handleCreateNewVIdeo = async(value: VideoInterface) => {
        await axios.post('/api/videos', { value })
        mutate()
      }

      return (
      <RootLayout >
        <VideoModal onSubmitCallback={(value) =>handleCreateNewVIdeo(value)} />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all">
              <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="all">Contents</TabsTrigger>
                <TabsTrigger value="active">Playlists</TabsTrigger>
                <TabsTrigger value="draft">Users</TabsTrigger>
              </TabsList>
                <div className="ml-auto">
                  <Button size="sm" className="h-8 gap-1" variant={"secondary"} onClick={() => openModal()}>
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Product
                    </span>
                  </Button>
                </div>
              </div>
              <TabsContent value="all">
                <Card x-chunk="dashboard-06-chunk-0">
                  <CardHeader>
                    <CardTitle>Contents</CardTitle>
                    <CardDescription>
                      Manage all contents within action sphere
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Input placeholder='Search content...' className='mb-2 ' />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden w-[100px] sm:table-cell">
                            <span className="sr-only">Image</span>
                          </TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Categories</TableHead>
                          <TableHead>
                            <span className="sr-only">Actions</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        { videos.map((video: VideoInterface) => (
                          <TableRow key={video.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Image
                              alt="Product image"
                              className="aspect-square rounded-md object-cover bg-gray-400"
                              height="100"
                              src={video.thumbnailUrl}
                              width="100"
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {video.title}
                          </TableCell>
                          <TableCell className="font-medium w-80">
                            {video.description}                          
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {video.duration}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className='flex gap-2'>
                              {video.categories.map(item => 
                                    <Badge key={item.id}>{item.name}</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
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
                                <DropdownMenuItem onClick={()=> openModal(video)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <div className="text-xs text-muted-foreground">
                      Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                      products
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </RootLayout>
    )
  }
  
