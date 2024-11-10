

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faPencil, faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import LocationPicker from '../../../admin/mainblock/shopManage/LocationPicker';
import { getAddressFromCoordinates } from '../../../utilities/functions';
import { NewShop, Shop } from '../../../utilities/interface';
import { addNewShop, fetchAllShop } from '../../../../services/adminService';
import { ToastContainer } from 'react-toastify';




const ShopProfile: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShop, setNewShop] = useState<NewShop>({ shopName: '', ownerName: '',email:'', image: null, phoneNumber: '', location:'' });
  const [previewUrl,setPreviewUrl] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number }>({ latitude: 0, longitude: 0 });
  const [image,setImage] = useState<File|null>(null);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);

  const fetchShops = async (page:number) => {
    try {
      // const response = await axios.get(`${import.meta.env.VITE_ENDPORTFRONT}/admin/shopdetails?page=${page}&limit=${itemsPerPage}`);
      // setShops(response.data.workShop); 
      // setTotalPages(response.data.totalPages)
      const shopsData = await fetchAllShop(page);
      setShops(shopsData.workShop); 
      setTotalPages(shopsData.totalPages)
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    }
  };


  const addShop = async () => {
    const formData = new FormData();
    formData.append('shopName',newShop.shopName);
    formData.append('ownerName',newShop.ownerName)
    formData.append('email',newShop.email)
    formData.append('phoneNumber',newShop.phoneNumber)
    formData.append('location',JSON.stringify(selectedLocation));
    if(newShop.image) formData.append('image',newShop.image);
    
    try{
      const address = await getAddressFromCoordinates(selectedLocation.latitude,selectedLocation.longitude);
      formData.append('address',JSON.stringify(address) )       
    }catch(error){
      console.error('error fetching address from coordinates:',error);
      formData.append('address',JSON.stringify({street:'',city:'',state:'',country:'',pincode:''}));
    }
    console.log('newShop',newShop)
      try {
        // await axios.post(`${import.meta.env.VITE_ENDPORTFRONT}/admin/addShop`, formData,{
        //   headers:{ 'Content-Type':'multipart/form-data' }
        // });
        await addNewShop(formData);
        setShowAddModal(false); 
        fetchShops(currentPage); 
      } catch (error) {
        console.error('Failed to add shop:', error);
    }
  };

  const handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(file) {
    setNewShop({ ...newShop, image: file })
    setPreviewUrl(URL.createObjectURL(file));
  }
}

  const handleRemoveImage = () => {
    setNewShop({ ...newShop, image: null })
    setPreviewUrl('');
  }

  useEffect(() => {
    fetchShops(currentPage);
  }, [currentPage]);

  return (
    <div className="p-4">
        <ToastContainer />

      <div className="flex justify-between mt-1 mb-4 pe-1">
        <h2 className="text-2xl font-bold ms-1 text-gray-800">
          Profile Management
        </h2>
        <button
          className="font-medium rounded bg-maincol text-white px-2 hover:bg-maincoldark"
          onClick={() => setShowAddModal(true)}
        >
          <FontAwesomeIcon icon={faPencil} /> Edit
        </button>
      </div>

      {/* Shop List */}
      <div className="overflow-x-auto w-full mb-6">
        
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
                type="number"
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

export default ShopProfile;
