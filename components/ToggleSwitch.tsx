import { useState } from 'react';

export default function ToggleSwitch() {
  const [isActive, setIsActive] = useState(true);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="relative w-full bg-black rounded-full p-2 flex items-center">
        <div
          onClick={handleToggle}
          className={`flex-1 text-center py-2 rounded-full cursor-pointer transition-all duration-300 ${
            isActive ? 'text-black bg-white' : 'text-white'
          }`}
        >
          Sfoglia novità
        </div>
        <div
          onClick={handleToggle}
          className={`flex-1 text-center py-2 rounded-full cursor-pointer transition-all duration-300 ${
            !isActive ? 'text-black bg-white' : 'text-white'
          }`}
        >
          Le mie playlist
        </div>
        <div
          className={`absolute top-1 h-full bg-white rounded-full transition-all duration-300 ${
            isActive ? 'left-1' : 'left-1/2'
          }`}
        ></div>
      </div>
    </div>
  );
}
