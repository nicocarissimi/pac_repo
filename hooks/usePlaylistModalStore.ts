import { create } from 'zustand';

export interface ModalStoreInterface {
  videoId?: string;
  isOpenPlaylist: boolean;
  openPlaylistModal: (movieId: string) => void;
  closePlaylistModal: () => void;
}

const usePlaylistModalStore = create<ModalStoreInterface>((set) => ({
  videoId: undefined,
  playlistId: undefined,
  isOpenPlaylist: false,
  openPlaylistModal: (videoId: string) => set({ isOpenPlaylist: true, videoId}),
  closePlaylistModal: () => set({ isOpenPlaylist: false, videoId: undefined }),
}));

export default usePlaylistModalStore;