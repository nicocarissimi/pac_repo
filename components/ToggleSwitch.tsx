import React, {useCallback, useState} from 'react';

interface ToggleProps {
  onChange?: any;
  option1: string;
  option2: string;
  boolFlag: boolean;
  setBool: React.Dispatch<React.SetStateAction<boolean>> | any 
}

 const ToggleSwitch: React.FC<ToggleProps> = ({ onChange, option1, option2, boolFlag, setBool}) =>{
  const [isActive, setIsActive] = useState(boolFlag);

  const handleToggle = useCallback(() => {
    if(boolFlag !== null){
      setIsActive(s=>!s)
      setBool(!boolFlag)
      return
    }
    setIsActive(!isActive)
    
  },[boolFlag]);

  return (
    <div className="flex justify-between items-center w-full">
      <div className="relative w-full bg-zinc-800 rounded-full p-2 flex items-center">
        <div
          onClick={onChange? onChange: handleToggle}
          className={`flex-1 text-center py-2 rounded-full cursor-pointer transition-all duration-300 ${
            isActive ? 'text-black bg-white' : 'text-white'
          }`}
        >
          {option1? option1: "Le tue playlist"}
        </div>
        <div
          onClick={onChange? onChange: handleToggle}
          className={`flex-1 text-center py-2 rounded-full cursor-pointer transition-all duration-300 ${
            !isActive ? 'text-black bg-white' : 'text-white'
          }`}
        >
          {option2? option2: "Novità"}
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
export default ToggleSwitch
