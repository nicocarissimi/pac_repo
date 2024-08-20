export interface MovieInterface {
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
  userId: string;
  name: string;
  isPublic: boolean;
}