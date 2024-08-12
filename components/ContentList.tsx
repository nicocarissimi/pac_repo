import React from 'react'

export default function ContentList() {

  const contentList = [
    {id:'1', image: '1', name: 'Primo content'},
    {id:'2',image: '2', name: 'Secondo content'},
    {id:'3',image: '3', name: 'Terzo content'},
    {id:'4',image: '3', name: 'Terzo content'},
  ]
  return (
    <div id='content-list-container' className='w-full h-full overflow-y-auto pt-4'>
        {contentList.map((content) => 
            <div id='card' className='w-full h-[190px] rounded-2xl bg-black p-4 mb-4' key={content.id}>
                    <div className='flex w-full gap-4 h-full'>
                        <div className='bg-white w-[20%] h-full rounded-2xl'></div>
                        <div className='bg-red-200 w-[80%] h-full rounded-2xl'></div>
                    </div>
            </div>
        )}    
    </div>
  )
}
