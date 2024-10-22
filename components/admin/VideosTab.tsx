import { Input } from "../ui/input"
import { Button } from "../ui/button"
import useVideo from "@/hooks/useVideo"
import { useEffect, useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { VideoInterface } from "@/libs/definitions"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import Image from "next/image"
import axios from "axios"
import { Badge } from "../ui/badge"
import VideoModal from "./VideoModal"
import useCreateEditVideoDialog from "@/hooks/admin/useCreateEditVideoDialog"

export const VideosTab = () => {
    const { openModal } = useCreateEditVideoDialog();  
    const { data: videos=[], mutate } = useVideo()
    const [videoList, setVideoList] = useState([])

    useEffect(()=>{
        setVideoList(videos)
    },[videos])

    const handleInputSearch = (item: React.ChangeEvent<HTMLInputElement>) => {
        if (item.target.value.length > 0) {
          setVideoList(videos.filter((video: VideoInterface) => 
            video.title.toLowerCase().includes(item.target.value.toLowerCase()) || 
            video.description.toLowerCase().includes(item.target.value.toLowerCase()
          )))
        }
    }

    
    const handleCreateNewVideo = async(value: VideoInterface) => {
        await axios.post('/api/videos', { value })
        mutate()
    }

    const handleDeleteVideo = async(videoId: string) => {
        await axios.delete(`/api/videos/${videoId}`)
        mutate()
    }


    return (
        <>
        <VideoModal onSubmitCallback={(value) => handleCreateNewVideo(value)} />
            <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Contents</CardTitle>
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
                { videoList.map((video: VideoInterface) => (
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
                          <Badge key={item.name}>{item.name}</Badge>
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
                        <DropdownMenuItem onClick={() => handleDeleteVideo(video.id!)}>Delete</DropdownMenuItem>
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
            Showing <strong>1-{videos.length < 10 ? videos.length : '10'}</strong> of <strong>{videos.length}</strong>{" "}
            contents
          </div>
          </CardFooter>
        </Card>
    </>
    )
}

export default VideosTab;