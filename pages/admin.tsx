import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import React, { useState } from 'react'
import RootLayout from '@/components/layout';
import {
  PlusCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import Contents from '@/components/admin/ContentsTab';
import Playlists from '@/components/admin/PlaylistsTab';
import { TabsEnum } from '@/libs/definitions';
import UsersTab from '@/components/admin/UsersTab';
import useCreateEditVideoDialog from '@/hooks/admin/useCreateEditVideoDialog';
import useCreateEditPlaylistDialog from '@/hooks/admin/useCreateEditPlaylistDialog';

  export default function AdminDashboard() {
      const { openModal: openContentsModal } = useCreateEditVideoDialog();
      const { openModal: openPlaylistModal }  = useCreateEditPlaylistDialog();

      const [tabValue, setTabValue] = useState(TabsEnum.CONTENTS)

      const handleOpenModal = () => {
        switch(tabValue) {
          case TabsEnum.CONTENTS: openContentsModal()
          break;
          case TabsEnum.PLAYLISTS: openPlaylistModal()
          break;
          default: 
        }
      }

      return (
      <RootLayout >
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs value={tabValue}>
              <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="contents" onClick={()=>setTabValue(TabsEnum.CONTENTS)}>Contents</TabsTrigger>
                <TabsTrigger value="playlists" onClick={()=>setTabValue(TabsEnum.PLAYLISTS)}>Playlists</TabsTrigger>
                <TabsTrigger value="users" onClick={()=>setTabValue(TabsEnum.USERS)}>Users</TabsTrigger>
              </TabsList>
              { tabValue !== TabsEnum.USERS &&
                <div className="ml-auto">
                  <Button size="sm" className="h-8 gap-1" variant={"secondary"} onClick={() => handleOpenModal()}>
                    <PlusCircle className="h-3.5 w-3.5" />
             
                      <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Product
                      </span>
                  </Button>
                </div>
              }
              </div>
              <TabsContent value="contents">
                  <Contents />
              </TabsContent>
              <TabsContent value='playlists'>
                  <Playlists />;
             </TabsContent>
              <TabsContent value='users'>
                  <UsersTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </RootLayout>
    )
  }
  
