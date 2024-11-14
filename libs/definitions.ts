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

export interface PlaylistVideoInterface {
  title: string;
  videoUrl: string;
}

export interface PlaylistInterface {
  id?: string;
  userId?: string;
  name: string;
  isPublic: boolean;
  thumbnailUrl: string;
  videos: PlaylistVideoInterface[];
}

export interface PlaylistWithVideoInterface extends PlaylistInterface {
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
  learning_time: number;
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

export const convertDuration = (duration?: number, stringable=true) => {
  if(duration){
    const prefix = Math.floor(duration / 60)
    const decimal = duration % 60
    var result = prefix.toString() + (stringable ? ' min ' : '.')
      if(decimal > 0){
        result = result + decimal.toString() + (stringable ? ' s': '')
      }
      return result
    }
  return
}