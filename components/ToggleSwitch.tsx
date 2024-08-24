import React, {useState} from 'react';

interface ToggleProps {
  onChange?: any;
  option1?: string;
  option2?: string;
  boolFlag?: boolean;
  setBool?: any 
}

 const ToggleSwitch: React.FC<ToggleProps> = ({ onChange, option1, option2, boolFlag, setBool}) =>{
  const [isActive, setIsActive] = useState(true);

  const handleToggle = () => {
    console.log(boolFlag)
    if(boolFlag !== null){
      setBool(!boolFlag)
      setIsActive(!isActive)
      return
    }
    setIsActive(!isActive)
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="relative w-full bg-black rounded-full p-2 flex items-center">
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
