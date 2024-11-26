import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { setpincode } from '../../../features/estimateSlice';
import { fetchPincode } from '../../../services/userService';
import { HttpStatusCode } from '../../utilities/interface';

export interface estimateProps {
    setActiveSection:React.Dispatch<React.SetStateAction<string>>;
  }

const Locationfind:React.FC<estimateProps> = ({setActiveSection}) => {
    const [input, setInput] = useState<string>(''); 
    const [pincodeSuggestions, setPincodeSuggestions] = useState<string[]>([]); 
    const [selectedPincode, setSelectedPincode] = useState<string | null>(null); 
    const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false); 
    const dispatch = useDispatch();

    const handleInputVal = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (/^\d{0,6}$/.test(value)) { setInput(value); }
  };

    const fetchPincodeSuggestions = async (pincode: string) => {
    if (pincode.length >= 1) {
      try {
        const response = await fetchPincode(pincode);
        if(response.status !== HttpStatusCode.SUCCESS)throw new Error('error fetching pincode suggestions')
        const data = response.data;
      
        setPincodeSuggestions(data.suggestions || []);
      } catch (error) {
        console.error('Error fetching pincode suggestions:', error);
      }
    } else {
      setPincodeSuggestions([]);
    }
  };

  useEffect(() => {
    if (input.length >= 1 ) {
      fetchPincodeSuggestions(input);
    } else {
      setPincodeSuggestions([]);
    }
  }, [input]);

  const handleSelectPincode = (pincode: string) => {
    setInput(pincode);
    setSelectedPincode(pincode);
    setPincodeSuggestions([]);
  };

    const handleLocation = () => {
      dispatch(setpincode(input))
      setActiveSection('Workshop')
    };

    useEffect(() => {
      if ((input.length === 6 && /^[0-9]{6}$/.test(input)) || selectedPincode) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }
    }, [input, selectedPincode]);

  return (
    <div className="flex justify-center p-5 pt-2">
    <div className="flex max-w-6xl mx-auto px-4 mb-10 py-12 flex-col mt-24 items-center border rounded-lg">
      <h2 className="text-5xl font-semibold">Enter your Pincode</h2>

      <form className="mt-10">
        <label htmlFor="pincode" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
          pincode
        </label>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={handleInputVal}
            className="block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50"
            placeholder="Enter Pincode..."
            required
          />
          <button
            type="button"
            onClick={handleLocation}
            disabled={!isButtonEnabled}
            className={`${!isButtonEnabled && 'cursor-not-allowed ' } btn-primary absolute end-2.5 bottom-2.5 px-4 py-2 `}
          >
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        {pincodeSuggestions.length > 0 && (
          <div className="absolute mt-2 w-96 bg-white border border-gray-300 rounded-lg shadow-lg">
            {pincodeSuggestions.map((suggestion) => (
              <div
                key={suggestion}
                className="cursor-pointer p-2 hover:bg-gray-100"
                onClick={() => handleSelectPincode(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  </div>


  );
}

export default Locationfind