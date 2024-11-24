import React from 'react'
import { estimateProps } from './Locationfind'

const VehicleDetails:React.FC<estimateProps> = ({setActiveSection}) => {

    // const dispatch = useDispatch()

    // const handleinputval = (e:React.ChangeEvent<HTMLInputElement>) =>{
    //     const value = e.target.value;
    // if (value.length <= 6) {setInput(value);}
    // }

    const handlelocation = () => {
        setActiveSection('RepairService')
    }


  return (
    <div className="flex justify-center p-5 pt-2  ">
      <div className="flex max-w-6xl mx-auto px-4 mb-10 py-12  flex-col mt-24 items-center ">
        <h2 className="text-5xl font-semibold">Tell us about your vehicle</h2>

        <form className="mt-10 ">
          <label htmlFor="pincode"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
            pincode
          </label>
          <div className="relative ">
            <input type="number" 
            // value={input}
              // onChange={(e) => handleinputval(e)}
              className="block w-96 p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 "
              placeholder="Enter Pincode. . ." required
            />
            <button
              type="button" onClick={() => handlelocation()}
              className="btn-primary absolute end-2.5 bottom-2.5 px-4 py-2">Continue</button>
          </div>
        </form>
      </div>
    </div>


//     <div className='min-h-screen flex flex-col mt-24 items-center'>
//     <h2 className="text-5xl">Tell us about your vehicle</h2>
// </div>
  )
}

export default VehicleDetails