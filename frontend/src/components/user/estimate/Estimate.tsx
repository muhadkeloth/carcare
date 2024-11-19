import React, { useState } from 'react'
import Header from '../reusableComponents/Header'
import Footer from '../reusableComponents/Footer'
import Locationfind from './Locationfind'
import VehicleDetails from './VehicleDetails'
import RepairService from './RepairService'
import FindEstimate from './FindEstimate'

const Estimate:React.FC = () => {
  const [activeSection, setActiveSection] = useState('Location')
  return (
    <div>
      <Header />

        {activeSection === 'Location'  && < Locationfind setActiveSection={setActiveSection} />}
        {activeSection === 'Vehicle'  && <VehicleDetails setActiveSection={setActiveSection} />}
        {activeSection === 'RepairService'  && <RepairService setActiveSection={setActiveSection} />}
        {activeSection === 'Estimate'  && <FindEstimate setActiveSection={setActiveSection} />}   

      <Footer />
    </div>
  )
}

export default Estimate