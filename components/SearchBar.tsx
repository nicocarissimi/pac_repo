import useSearchVideo from '@/hooks/useSearchVideo';
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';

const SearchBar = () => {
  const [value,setValue] = useState('')
  const {setSearchValue } = useSearchVideo()

  const handleSearchValue = (item:React.ChangeEvent<HTMLInputElement>) => {
    if (item) {
      const text = item.target.value;
      setValue(text);
      updateSearchValue(text)
    }
  }

  const updateSearchValue = useCallback(
    debounce((text: string) => {
      setSearchValue(text);
    }, 800),
    [] // Empty dependency array to keep the debounced function stable
  );

  return (
    <div className="ml-30 w-[60%]">
      <div className="flex items-center justify-center max-w-2xl mx-auto space-x-4">

        <input
          type="text"
          value={value}
          onChange={handleSearchValue}
          placeholder="Search for video..."
          className="flex-grow px-4 py-1 text-lg text-gray-700 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
        />
      </div>
    </div>
  );
};

export default SearchBar;
