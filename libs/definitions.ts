export interface VideoInterface {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    duration: string;
    genre: string;
  }
  
  
  export interface PlaylistInterface {
    id: string;
    userId?: string;
    name: string;
    isPublic: boolean;
  }


export enum Role { 
    ADMIN= "admin" , 
    USER= "user" 
}

export type UserRole = "admin" | "user"