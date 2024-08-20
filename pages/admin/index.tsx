import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import React from 'react'
import ContentItem from './content-item';
import { CreateContentDialog } from './create-content-dialog';

export async function getServerSideProps(context: NextPageContext) {
    const session = await getSession(context);
  
    if (!session) {
      return {
        redirect: {
          destination: '/auth',
          permanent: false,
        }
      }
    }
  
    return {
      props: {}
    }
  }

const AdminDashboard = () => {
    const contents = [{id:1},{id:2},{id:3},{id:4},{id:5},{id:6},{id:6},{id:6}]
  console.log(contents)
  return (
    <>
      <div className='fle flex-col w-full h-full absolute justify-around px-4 border-black overflow-hidden'>
          <div className='w-full rounded-2xl mb-4 fixed z-40 h-[10%]'>
            <div className='flex w-full justify-between bg-black p-2'>
                <input type="text" className='rounded-2xl placeholder:text-black outline-none w-[90%] px-4' placeholder='Search content...' />
                <CreateContentDialog />
            </div>
          </div>
          <div id='content-container' className='rounded-2xl px-2 w-full mt-20 flex flex-col gap-2 overflow-y-scroll max-h-[90%]'>
            {contents.map((item)=>{
                return (
                  <ContentItem item={item} />
                )
            })
            }
          </div>
        </div>
    </>
  )
}

export default AdminDashboard;
