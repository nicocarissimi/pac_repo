export interface VideoInterface {
    id?: string
    title: string;
    description: string;
    thumbnailUrl: string;
    author: string;
    videoUrl: string;
    duration: number | undefined;
    categories:  CategoryInterface[]
}

export interface CategoryInterface {
  id?: string;
  name: string;
}

export function defaultVideo(): VideoInterface {
  return {
    id: "",
    title: "",
    description: "",
    thumbnailUrl: "",
    author: "",
    videoUrl: "",
    duration: undefined,
    categories: [{name:""}]
  };
}

export interface PlaylistInterface {
  id?: string;
  userId?: string;
  name: string;
  isPublic: boolean;
  propaedeutic: boolean;
  thumbnailUrl: string;
  videos_title?: string[]
}

export interface PlaylistWithVideoInterface extends Omit<PlaylistInterface,'videos_title'>{
  videos: VideoInterface[]
}

export interface UserInterface {
  id: string;
  name: string;
  image: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  favoriteIds: string;
  playlists: string;
  favoriteCategories: CategoryInterface[]
  role: string
}


export enum Role { 
    ADMIN= "admin" , 
    USER= "user" 
}

export type UserRole = "admin" | "user"

export enum UserRoleEnum {
  ADMIN = 'admin',
  USER = 'user'
}

export type ModalType = "playlist" | "video"

export enum ModalEnum {
  PLAYLIST="playlist",
  VIDEO="video"
}

export enum TabsEnum {
  VIDEOS='videos',
  PLAYLISTS= 'playlists',
  USERS= 'users'
}