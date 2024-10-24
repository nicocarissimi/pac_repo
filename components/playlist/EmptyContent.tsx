import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import useVideo from "@/hooks/useVideo";
import axios from "axios";
import { PlusCircle } from "lucide-react"
import Router from "next/router";
import { useCallback } from "react";
import { useSWRConfig } from "swr";

interface EmptyContentProps {
    playlistId: string
}

const EmptyContent: React.FC<EmptyContentProps> = ({playlistId}) => {
    const { data: suggestedVideos = [] } = useVideo();
    const { mutate } = useSWRConfig();

    const handleAddVideo = useCallback(async (videoId:string) => {
        try {
          await axios.post(`/api/playlist/${playlistId}`, {
            videoIds: [videoId]
          }).then(() => {
                
              });
        }catch(error){
            console.error('An unknown error occurred:', error);
            alert('An unknown error occurred');
        }
        mutate(`/api/playlist`);
                mutate(`/api/playlist/${playlistId}`);
    },[playlistId]);

    return (
        <Card className="w-full max-w-3xl mx-auto bg-zinc-800 text-background border-0">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">Your Playlist is Empty</CardTitle>
                <CardDescription>Start adding some videos to your playlist!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button className="w-full" size="lg" onClick={()=> {Router.push('/')}}>
                    <PlusCircle className="mr-2 h-5 w-5"/>
                    Add New Content
                </Button>
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Suggested videos to add:</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                        {suggestedVideos.map((video) => (
                            <Card key={video.id} className="flex items-center p-4 hover:bg-zinc-600 transition-colors cursor-pointer gap-2 bg-zinc-900 border-0">
                                <div className="w-[30%] h-[50px] bg-cover bg-center rounded-2xl" style={{ backgroundImage: `url(${video.thumbnailUrl})` }}></div>
                                <div className="flex-grow">
                                    <h4 className="text-lg font-bold text-white">{video.title}</h4>
                                </div>
                                <Button variant="ghost" size="icon" onClick={()=>handleAddVideo(video.id)}>
                                    <PlusCircle className="h-5 w-5 text-white" />
                                    <span className="sr-only">Add to playlist</span>
                                </Button>
                            </Card>
                        ))}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="justify-center">
                <p className="text-sm text-muted-foreground">
                    Don't see what you like? Use the 'Add New Content' button to search for more videos.
                </p>
            </CardFooter>
        </Card>
    )
}

export default EmptyContent;