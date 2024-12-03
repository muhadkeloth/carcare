
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faPlus, faX } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import LocationPicker from '../../../reuseComponents/LocationPicker';
import { getAddressFromCoordinates, ToastActive } from '../../../utilities/functions';
import { HttpStatusCode, NewShop, Shop } from '../../../utilities/interface';
import { addNewShop, fetchAllShop, toggleShopStatus } from '../../../../services/adminService';
import { ThreeDots } from 'react-loader-spinner';
import Table from '../../../reuseComponents/Table';
import { handleInputValue } from '../../../utilities/validation';



const ShopManagement: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newShop, setNewShop] = useState<NewShop>({ shopName: '', ownerName: '',email:'', image: null, phoneNumber: '', location:'' });
  const [previewUrl,setPreviewUrl] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<[number, number ]>([0, 0]);
  const [currentPage,setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [toggleId, setToggleId] = useState('')
  const [isLoading,setIsLoading] = useState(false)


  const fetchShops = async (page:number) => {
    try {
      const shopsData = await fetchAllShop(page);
      setShops(shopsData.workShop); 
      setTotalPages(shopsData.totalPages)
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
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
    
    setIsLoading(true);
    try{
      const address = await getAddressFromCoordinates(selectedLocation);
      formData.append('address',JSON.stringify(address) )       
    }catch(error){
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
      setIsLoading(false);
      setShowAddModal(false); 
      formData.append('address',JSON.stringify({street:'',city:'',state:'',country:'',pincode:''}));
    }
      try {
        await addNewShop(formData);
        setShowAddModal(false); 
        fetchShops(currentPage); 
        ToastActive('success','new shop added successfully')
      } catch (error) {
        const errorMessage = (error as Error).message;
        ToastActive('error',errorMessage)
      }finally{
      setIsLoading(false);
    }
  };
  
  const toggleStatus = async(id:string) =>{
    try{
      const response = await toggleShopStatus(id);
      if(response.status = HttpStatusCode.CREATED){
        const index = shops.findIndex(shop => shop._id == id);
        if(index !== -1){
          const updatedShops = [...shops];
          updatedShops[index] = { ...updatedShops[index], isActive: !updatedShops[index].isActive };
          setShops(updatedShops)
        }
        ToastActive('success','status changed successfully')
      }else{ ToastActive('error','status toggle failed') }
    }catch(error){
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
    }finally{
      setToggleId('');
      setShowConfirmModal(false);
    }
  }

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

  const tableHeaders = [
    { label: 'Image', key: 'image' },
    { label: 'Shop Name', key: 'shopName' },
    { label: 'Owner Name', key: 'ownerName' },
    { label: 'Email', key: 'email' },
    { label: 'Phone Number', key: 'phoneNumber' },
    { label: 'Address', key: 'address' },
    // { label: 'Status', key: 'isActive' },
  ];

  const renderActions = (shop: any) => (
    <span onClick={() => toggleStatus(shop._id)}
      className={`cursor-pointer ${ shop.isActive
                ? "text-green-600 hover:text-green-400"
                : "text-red-600 hover:text-red-400" }`} >
      {shop.isActive ? "Active" : "Block"}
    </span>
  );


  useEffect(() => {
    fetchShops(currentPage);
  }, [currentPage]);

  return (
    <div className="p-4">

      <div className="flex justify-between mt-1 mb-4 pe-1">
        <h2 className="text-2xl font-bold ms-1 text-gray-800"> Shop Management </h2>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> Add
        </button>
      </div>

      <Table headers={tableHeaders} data={shops} renderActions={renderActions} />

      <div className="flex justify-center items-center mt-4">
        <button className="btn-primary disabled:bg-gray-200" disabled={currentPage === 1} 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <span className="text-sm mx-2 text-gray-600"> Page {currentPage} of {totalPages} </span>
        <button className="btn-primary disabled:bg-gray-200" disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages)) } >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center overflow-y-scroll ">
          <div className="bg-white m-5 p-6 rounded shadow-md w-full  max-w-lg">
            <h3 className="text-lg font-bold  mb-4">Add New Shop</h3>

            <div className="mb-3 flex gap-3">
              <div className="w-full">
                <label className=" text-sm  font-medium text-gray-700">Shop Name</label>
                <input type="text" value={newShop.shopName} placeholder="Shop Name"
                  onChange={(e) => setNewShop({ ...newShop, shopName: e.target.value }) }
                  className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" />
              </div>

              <div className="w-full">
                <label className=" text-sm font-medium text-gray-700">Owner Name</label>
                <input type="text" value={newShop.ownerName}
                  onChange={(e) =>setNewShop({ ...newShop, ownerName: e.target.value })}
                  className="mt-1 flex w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" />
              </div>
            </div>

            <div className="mb-3 flex gap-3">
              <div className=" w-full">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="text" value={newShop.email}
                  onChange={(e) =>setNewShop({ ...newShop, email: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"/>
              </div>

              <div className="w-full">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input type="text" placeholder="+91 0000 000 000"
                  value={newShop.phoneNumber}
                  onChange={(e) =>handleInputValue(e, 10) && setNewShop({ ...newShop, phoneNumber: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"/>
              </div>
            </div>

            <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">Location</label>
              <MapContainer 
                center={[11.875080, 75.373848]} 
                zoom={10} 
                className="h-72 w-full z-10" >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker onLocationChange={setSelectedLocation} />
              </MapContainer>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Shop Image</label>
              <input type="file" required onChange={handleImageChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-maincol hover:file:bg-maincoldark"/>
              {previewUrl && (
                <div className="relative mt-3 w-32 h-32">
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full rounded-lg" />
                  <button onClick={handleRemoveImage}
                    className="absolute top-1 right-1 bg-gray-500 hover:bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs" >
                    <FontAwesomeIcon icon={faX} />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-4">
              <button onClick={() => setShowAddModal(false)} className="btn-secondary mr-2" >Cancel</button>
              <button onClick={addShop} className="btn-primary">
                {!isLoading ? ("Add Shop"):( <ThreeDots color="white" height={10} /> )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmModal && (
        <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Are you sure you want to confirm change Shop Status?</h3>
            <div className="flex items-center justify-end">
              <button className="btn-secondary mr-2" onClick={() => { setShowConfirmModal(false); setToggleId(""); }} >
                Cancel
              </button>
              <button className="btn-primary" onClick={() => toggleStatus(toggleId)} >Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopManagement;
