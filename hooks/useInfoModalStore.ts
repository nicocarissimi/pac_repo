import { create } from 'zustand';

export interface ModalStoreInterface {
  videoId?: string;
  isOpen: boolean;
  openModal: (videoId: string) => void;
  closeModal: () => void;
}

const useInfoModalStore = create<ModalStoreInterface>((set) => ({
  videoId: undefined,
  isOpen: false,
  openModal: (videoId: string) => set({ isOpen: true, videoId }),
  closeModal: () => set({ isOpen: false, videoId: undefined }),
}));

export default useInfoModalStore;
