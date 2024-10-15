import { PlaylistInterface } from '@/libs/definitions';
import { create } from 'zustand';

export interface CreateEditModalInterface {
  playlist?: PlaylistInterface;
  isOpen: boolean;
  openModal: (playlist?: PlaylistInterface) => void;
  closeModal: () => void;
}

const useCreateEditPlaylistDialog = create<CreateEditModalInterface>((set) => ({
  playlist: undefined,
  isOpen: false,
  openModal: (playlist?: PlaylistInterface) => {
    set({ isOpen: true, playlist })},
  closeModal: () => set({ isOpen: false, playlist: undefined }),
}));

export default useCreateEditPlaylistDialog;
