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
    <div className='min-h-screen flex flex-col mt-24 items-center'>
    <h2 className="text-5xl">Tell us about your vehicle</h2>
   


</div>
  )
}

export default VehicleDetails