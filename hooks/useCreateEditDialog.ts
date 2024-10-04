import { VideoInterface } from '@/libs/definitions';
import { create } from 'zustand';

export interface CreateEditModalInterface {
  video?: VideoInterface;
  isOpen: boolean;
  openModal: (video?: VideoInterface) => void;
  closeModal: () => void;
}

const useCreateEditDialog = create<CreateEditModalInterface>((set) => ({
  video: undefined,
  isOpen: false,
  openModal: (video?: VideoInterface) => {
    console.log(video)
    set({ isOpen: true, video })},
  closeModal: () => set({ isOpen: false, video: undefined }),
}));

export default useCreateEditDialog;
