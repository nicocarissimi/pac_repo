import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function ContentList() {

  const contentList = [
    {id:'1', image: '1', name: 'Primo content'},
    {id:'2',image: '2', name: 'Secondo content'},
    {id:'3',image: '3', name: 'Terzo content'},
    {id:'4',image: '3', name: 'Terzo content'},
  ]
  return (
    <ScrollArea className="h-full w-full rounded-md">
        {contentList.map((content) => <div key={content.id}>
            <div id='card' className='w-full h-[190px] rounded-2xl p-4'>
                    <div className='flex w-full gap-4 h-full'>
                        <div className='bg-white w-[20%] h-full rounded-2xl'></div>
                        <div className='bg-red-200 w-[80%] h-full rounded-2xl'></div>
                    </div>
            </div>
            <Separator className="my-2" />
            </div>
        )}    
        
    </ScrollArea>
  )
}
