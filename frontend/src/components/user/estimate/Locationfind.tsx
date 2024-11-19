import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setpincode } from '../../../features/estimateSlice';

export interface estimateProps {
    setActiveSection:React.Dispatch<React.SetStateAction<string>>;
  }

const Locationfind:React.FC<estimateProps> = ({setActiveSection}) => {
    const [input,setInput] = useState('');
    const dispatch = useDispatch()

    const handleinputval = (e:React.ChangeEvent<HTMLInputElement>) =>{
        const value = e.target.value;
    if (value.length <= 6) {setInput(value);}
    }

    const handlelocation = () => {
        dispatch(setpincode(input))
        setActiveSection('Vehicle')
    }

  return (
    <div className='min-h-screen flex flex-col mt-24 items-center'>
        <h2 className="text-5xl">Enter your location</h2>
       
<form className="w-1/4  mt-10">   
    <label htmlFor="pincode" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">pincode</label>
    <div className="relative">
        <input type="number" 
        value={input}
        onChange={(e)=> handleinputval(e) }
        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-mainclr-500 focus:border-mainclr-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-mainclr-500 dark:focus:border-mainclr-500" 
        placeholder="Enter Pincode. . ." required />
        <button type="button" onClick={()=>handlelocation()} className="btn-primary absolute end-2.5 bottom-2.5 px-4 py-2"><FontAwesomeIcon icon={faArrowRight} /></button>
    </div>
</form>

    </div>
  )
}

export default Locationfind