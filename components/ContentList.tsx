import React from 'react'

export default function ContentList() {

  const contentList = [
    {image: '1', name: 'Primo content'},
    {image: '2', name: 'Secondo content'},
    {image: '3', name: 'Terzo content'},
  ]
  return (
    <div className='py-10 w-full h-[95%] overflow-y-auto'>
        {contentList.map((content) => 
            <div id='card' className='w-full h-[200px] rounded-2xl bg-black p-4 mb-4'>
                    <div className='flex w-full gap-4 h-full'>
                        <div className='bg-white w-[20%] h-full rounded-2xl'></div>
                        <div className='bg-red-200 w-[80%] h-full rounded-2xl'></div>
                    </div>
            </div>
        )}    
    </div>
  )
}
