// import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faAngleRight } from '@fortawesome/free-solid-svg-icons';

// const ShopManagement:React.FC = () => {
//   return (
//     <>
//     <div className="flex justify-between mt-1 mb-4 pe-2">
//       <h2 className="text-2xl font-bold ms-1  text-gray-800">Shop Management</h2>
//       <button className="font-medium rounded bg-maincol  text-white px-2 hover:bg-maincoldark">
//         <FontAwesomeIcon icon={faPlus} /> Add
//       </button>
//     </div>


//     </>
//   )
// }

// export default ShopManagement






import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, useMapEvent, useMapEvents } from 'react-leaflet';




interface Shop {
  _id: number;
  name: string;
  address: string;
  image: string;
  phoneNumber: string;
  location: string; // Adjust based on the data type returned from your backend
}

interface NewShop {
  name: string;
  address: string;
  image: File | null; // Allow image to be either File or null
  phoneNumber: string;
  location: string;
}






const ShopManagement: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [showAddModal, setShowAddModal] = useState(false); // Controls Add Shop modal visibility
  const [newShop, setNewShop] = useState<NewShop>({ name: '', address: '', image: null, phoneNumber: '', location: '' });
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Fetch shop details from backend
  const fetchShops = async () => {
    try {
      const response = await axios.get('http://192.168.1.3:3000/admin/shopdetails');
      setShops(response.data.shops); // Ensure `shops` is the correct key from your backend response
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    }
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if(event.target.files && event?.target.files[0]){
      setNewShop({...newShop, image: event.target.files[0]});
    }
  }
  // Add a new shop
  const addShop = async () => {
    // const formData = new FormData();
    // formData.append('name',newShop.name);
    // formData.append('address',newShop.address)
    // formData.append('phoneNumber',newShop.phoneNumber)
    // formData.append('location',JSON.stringify(selectedLocation));
    const formData = {
      name:newShop.name,
      address:newShop.address,
      phoneNumber:newShop.phoneNumber,
      location:JSON.stringify(selectedLocation),
    }
    console.log(formData)
    // if(newShop.image) formData.append('image',newShop.image);
    try {
      await axios.post('http://192.168.1.3:3000/admin/addShop', formData);
      setShowAddModal(false); // Close modal after adding
      fetchShops(); // Refresh shop list
    } catch (error) {
      console.error('Failed to add shop:', error);
    }
  };

  const LocationPicker: React.FC = () => {
    useMapEvents({
      click(e:L.LeafletMouseEvent){
        setSelectedLocation({latitude:e.latlng.lat, longitude: e.latlng.lng })
      }
    });
    return selectedLocation ? (
      <Marker position={[selectedLocation.latitude,selectedLocation.longitude]}  /> 
    ):null;
  };

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between mt-1 mb-4 pe-1">
        <h2 className="text-2xl font-bold ms-1 text-gray-800">Shop Management</h2>
        <button
          className="font-medium rounded bg-maincol text-white px-2 hover:bg-maincoldark"
          onClick={() => setShowAddModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Add
        </button>
      </div>

      {/* Shop List */}
      <div className="overflow-x-auto w-full mb-6">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-4 text-left border-b border-gray-200">Shop Name</th>
              <th className="py-3 px-4 text-left border-b border-gray-200">Address</th>
              <th className="py-3 px-4 text-left border-b border-gray-200">Phone Number</th>
              <th className="py-3 px-4 text-left border-b border-gray-200">Location</th>
              <th className="py-3 px-4 text-left border-b border-gray-200">Image</th>
            </tr>
          </thead>
          <tbody>
            {shops.map((shop) => (
              <tr key={shop._id} className="border-b border-gray-200 hover:bg-gray-50 text-gray-700 text-sm">
                <td className="py-3 px-4">{shop.name}</td>
                <td className="py-3 px-4">{shop.address}</td>
                <td className="py-3 px-4">{shop.phoneNumber}</td>
                <td className="py-3 px-4">{shop.location}</td>
                <td className="py-3 px-4">
                  <img src={shop.image} alt={shop.name} className="w-16 h-16 object-cover rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Shop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-scroll">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">Add New Shop</h3>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Shop Name</label>
              <input
                type="text"
                value={newShop.name}
                onChange={(e) => setNewShop({ ...newShop, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={newShop.address}
                onChange={(e) => setNewShop({ ...newShop, address: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                value={newShop.phoneNumber}
                onChange={(e) => setNewShop({ ...newShop, phoneNumber: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Location</label>
              {/* <input
                type="text"
                value={newShop.location}
                onChange={(e) => setNewShop({ ...newShop, location: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              /> */}
              {/* <button onClick={locationPicker} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                {selectedLocation
                  ? `Selected: Lat ${selectedLocation.latitude}, Lng ${selectedLocation.longitude}`
                  : 'Pick Location'}
              </button> */}

                <MapContainer center={[40.7128, -74.0060]} zoom={10} style={{height:'300px',width:'100%'}} >
                  <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                  <LocationPicker />
                </MapContainer>
            </div>           
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                onChange={ handleImageChange }
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-maincol hover:file:bg-maincoldark"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded mr-2 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={addShop}
                className="bg-maincol text-white px-4 py-2 rounded hover:bg-maincoldark"
              >
                Add Shop
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ShopManagement;
