import React from 'react'
import { estimateProps } from './Locationfind'

const RepairService:React.FC<estimateProps> = ({setActiveSection}) => {

    const handlelocation = () => {
        setActiveSection('Estimate')
    }


  return (
    <div className='min-h-screen flex flex-col mt-24 items-center'>
    <h2 className="text-5xl">Select your repair service</h2>
   


</div>
  )
}

export default RepairService