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
  categories: z.array(categorySchema).nonempty({ message: "Please select at least one category"})
})

const VideoModal = () => {

  const { video: v, isOpen, closeModal } = useCreateEditDialog();
  const { data = [] } = useCategories()

  const [allCategories, setAllCategories] = useState([{ label:"", value:"" }])

  useEffect(() => {
    const response = data.map((d: CategoryInterface) => {
      return {
        "label": d.name,
        "value": d.name
      }
    })
    setAllCategories(response)
  },[ data ] )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: v? v: defaultVideo()
  })

  useEffect(()=> {
    if(v){
      form.reset(v)
    } else {
      form.reset(defaultVideo())
    }
  },[v])


  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={closeModal} modal={false}>
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
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categories</FormLabel>
              <FormControl>
                <MultiSelect
                   options={allCategories}
                   placeholder="Select categories"
                   onValueChange={(selectedValues) => {
                    const categories = selectedValues.map(value => ({"name":value}));
                    field.onChange(categories);
                  }}             
                   variant="inverted"
                   maxCount={3}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='w-full flex justify-end gap-2'>
          <Button variant={'outline'} onClick={closeModal}> Close </Button>
          <Button type="submit" className='items-end'>Submit</Button>
        </div>
      </form>
    </Form>
    </DialogContent>
    </Dialog>
  )
  
}

export default VideoModal;
