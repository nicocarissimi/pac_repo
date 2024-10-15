export interface VideoInterface {
    id?: string
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: number;
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
    videoUrl: "",
    duration: 0,
    categories: [{name:""}]
  };
}

export interface PlaylistInterface {
  id: string;
  userId?: string;
  name: string;
  isPublic: boolean;
  thumbnailUrl: string;
  videos_title?: string[]
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

export type ModalType = "playlist" | "video"

export enum ModalEnum {
  PLAYLIST="playlist",
  VIDEO="video"
}

export enum TabsEnum {
  CONTENTS='contents',
  PLAYLISTS= 'playlists',
  USERS= 'users'
}