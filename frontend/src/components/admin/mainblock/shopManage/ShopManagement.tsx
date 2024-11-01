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
import { faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import LocationPicker from './LocationPicker';




interface Shop {
  _id: number;
  shopName: string;
  ownerName: string;
  email:string;
  phoneNumber: string
  isActive:boolean;
  address:{
    street:string;
    city:string;
    state:string;
    country:string;
    pincode:string;
  }
  image: string;
  // location: {latitude:number,longitude:number}; 
}

interface NewShop {
  shopName: string;
  ownerName: string;
  email: string;
  image: File | null;
  phoneNumber: string;
  location: string;
}






const ShopManagement: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShop, setNewShop] = useState<NewShop>({ shopName: '', ownerName: '',email:'', image: null, phoneNumber: '', location:'' });
  const [previewUrl,setPreviewUrl] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  
  
  const [image,setImage] = useState<File|null>(null);
  const [location,setLocation] = useState(null)
  // Fetch shop details from backend

  const fetchShops = async () => {
    try {
      const response = await axios.get('http://192.168.1.3:3000/admin/shopdetails');
      setShops(response.data.shops); 
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    }
  };

  // Add a new shop
  const addShop = async () => {
    const formData = new FormData();
    formData.append('name',newShop.shopName);
    formData.append('ownerName',newShop.ownerName)
    formData.append('phoneNumber',newShop.phoneNumber)
    formData.append('location',JSON.stringify(selectedLocation));
      if(newShop.image) formData.append('image',newShop.image);
      try {
        await axios.post('http://192.168.1.3:3000/admin/addShop', formData);
        console.log('here')
        setShowAddModal(false); // Close modal after adding
        fetchShops(); // Refresh shop list
      } catch (error) {
        console.error('Failed to add shop:', error);
    }
  };
  

      
      // const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
      //   if(event.target.files && event?.target.files[0]){
      //     setNewShop({...newShop, image: event.target.files[0]});
      //   }
      // }


      const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
    if(file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl('');
  }

  useEffect(() => {
    fetchShops();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between mt-1 mb-4 pe-1">
        <h2 className="text-2xl font-bold ms-1 text-gray-800">
          Shop Management
        </h2>
        <button
          className="font-medium rounded bg-maincol text-white px-2 hover:bg-maincoldark"
          onClick={() => setShowAddModal(true)}
        >
          <FontAwesomeIcon icon={faPlus} /> Add
        </button>
      </div>

      {/* Shop List */}
      <div className="overflow-x-auto w-full mb-6">
        <table className="min-w-full border-collapse border border-gray-300"> {/*mb-6*/}
          <thead>
            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">  {/*leading-normal*/}
              <th className="py-3 px-4 text-left border-b border-gray-200">
                Shop Name
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-200">
              ownerName
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-200">
                Phone Number
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-200">
                Location
              </th>
              <th className="py-3 px-4 text-left border-b border-gray-200">
                Image
              </th>
            </tr>
          </thead>
          <tbody>
            {shops && shops.length > 0 ? (
              shops.map((shop) => (
                <tr
                  key={shop._id}
                  className="border-b border-gray-200 hover:bg-gray-50 text-gray-700 text-sm"
                >
                  <td className="py-3 px-4">{shop.shopName}</td>
                  <td className="py-3 px-4">{shop.ownerName}</td>
                  <td className="py-3 px-4">{shop.phoneNumber}</td>
                  <td className="py-3 px-4">{shop.isActive}</td>
                  <td className="py-3 px-4">
                    <img src={shop.image} alt={shop.shopName} className="w-16 h-16 object-cover rounded" />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-3">
                  No shops available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Shop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-scroll ">
          <div className="bg-white m-5 p-6 rounded shadow-md w-full  max-w-lg">
            <h3 className="text-lg font-bold  mb-4">Add New Shop</h3>
            <div className="mb-3 flex gap-3">
              <div className="w-full">
              <label className=" text-sm  font-medium text-gray-700">
                Shop Name
              </label>
              <input
                type="text"
                value={newShop.shopName}
                onChange={(e) =>
                  setNewShop({ ...newShop, shopName: e.target.value })
                }
                placeholder='Shop Name'
                className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
              </div>

              <div className='w-full'>
              <label className=" text-sm font-medium text-gray-700">
                Owner Name
              </label>
              <input
                type="text"
                value={newShop.ownerName}
                onChange={(e) =>
                  setNewShop({ ...newShop, ownerName: e.target.value })
                }
                className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                />
                </div>
            </div>

            <div className="mb-3 flex gap-3">
              <div className=" w-full">
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                value={newShop.email}
                onChange={(e) =>
                  setNewShop({ ...newShop, email: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
              </div>
              <div className='w-full'>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                value={newShop.phoneNumber}
                onChange={(e) =>
                  setNewShop({ ...newShop, phoneNumber: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
              />
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Location
              </label>

              <MapContainer
                center={[40.7128, -74.006]}
                zoom={10}
                style={{ height: "250px", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker onLocationChange={setSelectedLocation} />
              </MapContainer>

            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-maincol hover:file:bg-maincoldark"
              />
              {previewUrl && (
                <div className="relative mt-3 w-32 h-32">
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full rounded-lg" />
                  <button 
                  className='absolute top-1 right-1 bg-gray-500 hover:bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs' 
                  onClick={handleRemoveImage}>
                    <FontAwesomeIcon icon={faX} />
                    </button>
                </div>
              )}
               
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
