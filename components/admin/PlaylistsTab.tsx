import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import usePlaylist from "@/hooks/usePlaylist"
import { PlaylistInterface, PlaylistWithVideoInterface, VideoInterface } from "@/libs/definitions"
import PlaylistModal from "./PlaylistModal"
import axios from "axios"
import useCreateEditPlaylistDialog from "@/hooks/admin/useCreateEditPlaylistDialog"
import { Badge } from "../ui/badge"

export const PlaylistsTab = () => {
  const { openModal } = useCreateEditPlaylistDialog()
    const { data: playlists=[], mutate } = usePlaylist(false, undefined, undefined, true)
    const [playlistsList, setPlaylistsList] = useState([] as PlaylistInterface[])
    
    useEffect(() => {
      // Check if the new playlists are different before setting state
      if (JSON.stringify(playlists) !== JSON.stringify(playlistsList)) {
          setPlaylistsList(playlists);
      }
    }, [playlists, playlistsList]); 


    const handleInputSearch = (item: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistsList(playlists.filter((playlist: PlaylistInterface) => 
          playlist.name.toLowerCase().includes(item.target.value.toLowerCase())
    ))
    }
       
    const handleCreateNewPlaylist = async(value: {title:string, videos:[{url: string}], propaedeutic: boolean}) => {
      const playlist = {} as PlaylistWithVideoInterface
      playlist.name = value.title;
      playlist.propaedeutic = value.propaedeutic
      playlist.isPublic = true
      const newPlaylist = await axios.post('/api/playlist', { playlist }).then(res => res.data)
      const videos = await axios.get('/api/videos', {params: {videoUrl: value.videos.map(video => video.url) }}).then(res=>res.data)
      const videoIds = videos.map((video: VideoInterface) => video.id)
      await axios.post(`/api/playlist/${newPlaylist.id}`, {videoIds: videoIds} )
      mutate()
    }

    const handleDeletePlaylist = async( id: string ) => {
      await axios.delete(`/api/playlist/${id}`)
      mutate()
    }

    return (
      <>
      <PlaylistModal onSubmitCallback={(value) => handleCreateNewPlaylist(value)} />
        <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Playlists</CardTitle>
          <CardDescription>
            Manage all playlists within action sphere
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
                <TableHead>Videos</TableHead>
                <TableHead>Propaedeutic</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              { playlistsList.map((playlist: PlaylistInterface) => (
                <TableRow key={playlist.id}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover bg-gray-400"
                    height="100"
                    src={playlist.thumbnailUrl}
                    width="100"
                    priority
                  />
                </TableCell>
                <TableCell>
                  {playlist.name}
                </TableCell>
                <TableCell>
                  <div className='flex gap-2'>
                    {playlist.videos_title?.map(title=> (
                      <Badge key={title}>{title}</Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {playlist.propaedeutic.toString()}
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
                      <DropdownMenuItem onClick={()=>{
                        openModal(playlist)}}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeletePlaylist(playlist.id!)}>Delete</DropdownMenuItem>
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
            Showing <strong>1-{playlists.length < 10 ? playlists.length : '10'}</strong> of <strong>{playlists.length}</strong>{" "}
            playlists
          </div>
        </CardFooter>
      </Card>
      </>
    )
}

export default PlaylistsTab