import React from 'react';
import { PlaylistInterface } from '@/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { CreditCard, Ellipsis, Keyboard, Plus, Settings, User, Users } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface PlaylistDisplayProps {
  playlists: PlaylistInterface[];
  myPlaylists: boolean;
}

const PlaylistDisplay: React.FC<PlaylistDisplayProps> = ({ playlists, myPlaylists }) => {
  return (
    <ScrollArea className="rounded-md w-full h-full">
      <div className="p-4">
        { playlists.map((p) => (
          <div>
            <div key={p.id} className="text-md text-white flex w-full justify-between">
              <p>{p.name}</p>
              <DropdownMenu modal={false}>
              <DropdownMenuTrigger>
                  <Ellipsis size={"24px"} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align='end'>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Keyboard className="mr-2 h-4 w-4" />
                    <span>Keyboard shortcuts</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Users className="mr-2 h-4 w-4" />
                    <span>Team</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>New Team</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenu>
            </div>
            <Separator className='my-2'/>
          </div>
       ))}
      </div>
    </ScrollArea>
  );
};

export default PlaylistDisplay;