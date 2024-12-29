import Dashboard from './mainblock/Dash/Dashboard';
import UserManagement from './mainblock/UserManage/UserManagement';
import ShopManagement from './mainblock/shopManage/ShopManagement';
import { SectionMainProps } from '../utilities/interface';
import VehicleManagement from './mainblock/vehicleManage/VehicleManagement';
import PickupBrockerage from './mainblock/Brockerages/PickupBrockerage';
import BookingBrockerage from './mainblock/Brockerages/BookingBrockerage';



const AdminMain = ({ activeSection }:SectionMainProps) => {
  return (
    <div className="flex-1 p-1 sm:p-2 bg-gray-100">
        {activeSection === 'Dash' && <Dashboard />}
        {activeSection === 'UserManage' && <UserManagement />}
        {activeSection === 'VehicleManage' && <VehicleManagement />}
        {activeSection === 'ShopManage' && <ShopManagement />}
        {activeSection === 'BookingBrockerage' && <BookingBrockerage />}
        {activeSection === 'PickupBrockerage' && <PickupBrockerage />}
    </div>
  )
}



export default AdminMain