import { create } from "zustand";


export interface SearchVideoInterface {
    searchValue: string | undefined;
    setSearchValue: (text: string) => void;
}

const useSearchVideo = create<SearchVideoInterface>((set) => ({
    searchValue: undefined,
    setSearchValue: (text) => set({searchValue: text})
  }));
  
  export default useSearchVideo;