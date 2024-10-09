import React, { useEffect, useState } from 'react';
import useCreateEditDialog from '@/hooks/useCreateEditDialog';
import { Dialog,  DialogContent, DialogDescription,  DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Form, FormControl,  FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import useCategories from '@/hooks/useCategories';
import { CategoryInterface, defaultVideo } from '@/libs/definitions';
import { MultiSelect } from './ui/multiselect';
import axios from 'axios';

const categorySchema = z.object({
  name: z.string().min(2, {message: "Category must be at least 2 characters."})
})

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(1, {
    message: "Description must be at least 1 character."
  }),
  duration: z.string().min(1,{ message: "Insert a valid duration"}),
  videoUrl: z.string().min(1, {
    message: "videoUrl must contains a valid url"
  }),
  thumbnailUrl: z.string().min(1, {
    message: "thmbnailUrl must contains a valid url"
  }),
  categories: z.array(categorySchema).nonempty({ message: "Please select at least one category"})
})


type VideoModalType = {
  onSubmitCallback?: (value: z.infer<typeof formSchema>) => void
}

const VideoModal = ({onSubmitCallback}: VideoModalType) => {

  const { video: v, isOpen, closeModal } = useCreateEditDialog();
  const { data = [], mutate } = useCategories()

  const [allCategories, setAllCategories] = useState([{ label:"", value:"" }])

  useEffect(() => {
    const newCategories = data.map((d: CategoryInterface) => {
      return {
        "label": d.name,
        "value": d.name
      }
    })

    if(JSON.stringify(newCategories) !== JSON.stringify(allCategories)) {
      setAllCategories(newCategories)
    }

  },[data] )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  
  useEffect(()=> {
    if(v){
      form.reset(v)
    } else {
      form.reset(defaultVideo())
    }
  },[v])

  const handleClose = () => {
    closeModal()
    form.reset()
    form.clearErrors()
  }

  const handleCreateCategory = async(value: string) => {
    await axios.post('/api/categories', { value })
    mutate()
  }


  async function onSubmit(value: z.infer<typeof formSchema>) {
    if(onSubmitCallback) onSubmitCallback(value)
    closeModal()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={false}>
    <DialogContent className="sm:max-w-[600px]" onInteractOutside={(e)=>{e.preventDefault()}}>
      <DialogHeader>
        <DialogTitle>Create new content</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Insert description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder="Insert duratioon..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="videoUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video Url</FormLabel>
              <FormControl>
                <Input placeholder="Insert video url..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon Url</FormLabel>
              <FormControl>
                <Input placeholder="Insert icon url..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <div className='flex'>
                <MultiSelect
                   options={allCategories}
                   defaultValue={v? v.categories.map(category => category.name): undefined}
                   onItemCreate={handleCreateCategory}
                   placeholder="Select categories"
                   onValueChange={(selectedValues) => {
                    const categories = selectedValues.map(value => ({"name":value}));
                    field.onChange(categories);
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
          <Button variant={'outline'} onClick={handleClose}> Close </Button>
          <Button type="submit" className='items-end'>Submit</Button>
        </div>
      </form>
    </Form>
    </DialogContent>
    </Dialog>
  )
  
}

export default VideoModal;
