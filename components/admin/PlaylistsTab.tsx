import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import usePlaylist from "@/hooks/usePlaylist"
import { PlaylistInterface } from "@/libs/definitions"

export const PlaylistsTab = () => {
    const { data: playlists=[], mutate } = usePlaylist(true)

    const [playlistsList, setPlaylistsList] = useState(playlists)

    useEffect(()=>{
        setPlaylistsList(playlists)
    },[playlists])


    const handleInputSearch = (item: React.ChangeEvent<HTMLInputElement>) => {
        setPlaylistsList(playlists.filter((playlist: PlaylistInterface) => 
          playlist.name.toLowerCase().includes(item.target.value.toLowerCase())
    ))
    }

    console.log(playlists)

    return (
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
                  />
                </TableCell>
                <TableCell>
                  {playlist.name}
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
                      <DropdownMenuItem onClick={()=> {}}>Edit</DropdownMenuItem>
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
    )
}

export default PlaylistsTab