import useCreateEditPlaylistDialog from "@/hooks/admin/useCreateEditPlaylistDialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { MultiSelect } from "../ui/multiselect";
import useVideo from "@/hooks/useVideo";
import { useEffect, useState } from "react";
import { VideoInterface } from "@/libs/definitions";


const videoSchema = z.object({
    url: z.string()
})


export const formSchema = z.object({
    title: z.string().min(1,{message: "Please insert title"}),   
    videos: z.array(videoSchema).nonempty({message: "Playlist can't be empty"})
  })

type PlaylistModalProps = {
    onSubmitCallback?: (value: z.infer<typeof formSchema>, method?: string) => void
}

export default function PlaylistModal({onSubmitCallback}: PlaylistModalProps)  {

    const { playlist, isOpen, closeModal } = useCreateEditPlaylistDialog()
    const { data = []} = useVideo()

    const [allVideos, setAllVideos] = useState([{ label:"", value:""}])

    useEffect(() => {
        const videos = data.map((d: VideoInterface) => {
          return {
            "label": d.title,
            "value": d.videoUrl
          }
        })
    
        if(JSON.stringify(videos) !== JSON.stringify(allVideos)) {
          setAllVideos(videos)
        }
    
      },[data] )

    useEffect(()=> {
    if(playlist){
        form.reset({title: playlist.name, videos: data.map((video: VideoInterface) => video.title)})
    } else {
        form.reset()
        form.clearErrors()
    }
    },[playlist])

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    })

    const handleClose = () => {
        closeModal()
        form.reset()
        form.clearErrors()
    }

    async function onSubmit(value: z.infer<typeof formSchema>) {
        try{
            if(onSubmitCallback){
                if(playlist?.id){
                    onSubmitCallback(value, playlist?.id)     
                }
                else{
                    onSubmitCallback(value)
                }
                
            } 
            handleClose()
        }catch(e) {
            console.error(e)
        }
        
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
        <DialogContent className="sm:max-w-[600px]" onInteractOutside={(e)=>{e.preventDefault()}} data-testid="playlists-modal">
            <DialogHeader>
            <DialogTitle>Create new Playlist</DialogTitle>
            <DialogDescription>
                Click save when you're done.
            </DialogDescription>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                    <Input placeholder="Insert title..." {...field}/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            
            <FormField
                control={form.control}
                name="videos"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Videos</FormLabel>
                    <FormControl>
                    <div className='flex'>
                    <MultiSelect
                        options={allVideos}
                        placeholder="Select videos"
                        defaultValue={playlist ? playlist.videos.map(video => video.videoUrl) : undefined}
                        onValueChange={(selectedValues) => {
                        const videos = selectedValues.map(value => ({"url": value}));
                        field.onChange(videos);
                        }}             
                        variant="inverted"
                        maxCount={3}
                    />
                    </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <div className='w-full flex justify-end gap-2'>
                <Button variant={'outline'} onClick={handleClose} data-testid="playlist-modal-close-btn"> Close </Button>
                <Button type="submit" className='items-end'>Submit</Button>
            </div>
            </form>
        </Form>
        </DialogContent>
        </Dialog>
        )
}