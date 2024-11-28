import React, { useState } from "react";
import {  faPencilAlt, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MapContainer, TileLayer } from "react-leaflet";
import LocationPicker from "../../../../admin/mainblock/shopManage/LocationPicker";
import { shopProfile } from "../../../../../features/shopSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store";
import { toast } from "react-toastify";
import { fetchUpdateProfileDetails, fetchUploadProfileImage } from "../../../../../services/shopService";
import { HttpStatusCode } from "../../../../utilities/interface";
import { ToastActive } from "../../../../utilities/functions";
import { emailValidation, nameValidation, phoneNumberValidation } from "../../../../utilities/validation";



const EditProfile:React.FC = () => {
  const shopUserDetails = useSelector((state:RootState)=> state.shop.shopDetails)
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number }>(
    shopUserDetails?.location.coordinates 
    ? {latitude: shopUserDetails.location.coordinates[0], longitude:shopUserDetails.location.coordinates[1]}
    : { latitude: 0, longitude: 0 }
  );
  const [editedShopUser, setEditedShopUser] = useState<shopProfile | null>(shopUserDetails || null);
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  // const [errors, setErrors] = useState<{ [key: string]:string }>({});
  const [errors, setErrors] = useState<{ [key: string]:string }|null>(null);


  const handleInputChange = (key: keyof shopProfile, value: any) => {
    setEditedShopUser((prev)=> (prev ? {...prev, [key]:value} : null));
  }

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      try {
        const response = await fetchUploadProfileImage(formData)
        // if(response.status !== HttpStatusCode.CREATED) toast.error('failed to upload image.');
        if(response.status !== HttpStatusCode.CREATED) throw new Error('failed to upload image.');
          handleInputChange('image',response.data.imagePath);
          ToastActive('success','Image updated. please save for apply changes.');
          // toast.success('Image updated. please save for apply changes.');
      } catch (error) {
        // console.error('update image error',error);
        ToastActive('error','error uploading image.')
      }
    }
  };

  // const validateForm = (): boolean => {
  //   setErrors({});
  //   const newErrors:{[key:string]:string} = {};

  //   if(!editedShopUser?.shopName) newErrors.shopName = "Shop Name is required.";
  //   if(!editedShopUser?.ownerName) newErrors.ownerName = "Owner Name is required.";
  //   if(!editedShopUser?.email) newErrors.email = "Email is required.";
  //   if(!editedShopUser?.phoneNumber) newErrors.phoneNumber = "Phone Number is required.";
  //   if(!editedShopUser?.about) newErrors.about = "About is required.";

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0; 
  // };
  
  const handleSaveChanges = async () => {
    setShowConfirmModal(false)
    let flag = false;
    setErrors(null);
    // if(!editedShopUser) {toast.error('error occured'); return;};
    if(!editedShopUser) {ToastActive('error','error occured'); return;};
    // const newErrors:{[key:string]:string} = {};
    if(!editedShopUser?.shopName || nameValidation(editedShopUser?.shopName)){
      // newErrors.shopName = "Shop Name is required.";
      setErrors((prev) => ({...prev,shopName:'Shop Name is required.'}))
      flag = true;
    } 
    if(!editedShopUser?.ownerName || nameValidation(editedShopUser?.ownerName)){
      // newErrors.ownerName = "Owner Name is required.";
      setErrors((prev) => ({...prev,ownerName:'Owner Name is required.'}))
      flag = true;
    } 
    if(!editedShopUser?.email || !emailValidation(editedShopUser?.email)){
      // newErrors.email = "Email is required.";
      setErrors((prev) => ({...prev,email:'Email is required.'}))
      flag = true;
    } 
    if(!editedShopUser?.phoneNumber || phoneNumberValidation(editedShopUser?.phoneNumber)){
      // newErrors.phoneNumber = "Phone Number is required.";
      setErrors((prev) => ({...prev,phoneNumber:'Phone Number is required.'}))
      flag = true;
    } 
    if(!editedShopUser?.about || nameValidation(editedShopUser?.about)){
      // newErrors.about = "About is required.";
      setErrors((prev) => ({...prev,about:'About is required.'}))
      flag = true;
    } 
    if(flag)return;
    
    const changesMade = JSON.stringify(editedShopUser) !== JSON.stringify(shopUserDetails);
    // if(!changesMade){toast.info('No changes applied.');return;};
    if(!changesMade){ToastActive('info','No changes applied.');return;};
    
    try {
      const response = await fetchUpdateProfileDetails({...editedShopUser,location:{type:"Point",coordinates:[selectedLocation.latitude,selectedLocation.longitude]}});
      if(response.data.success){
        ToastActive('success',"shop details updated successfully");
      }else{
        ToastActive('error','failed to update shop details.')
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
      // console.error('update shop details error',error);
      // toast.error('error uploading shop details.')
    }
  }

  return (
    <div className="flex flex-col sm:flex-row my-6 sm:mx-4">
      <div className="flex flex-col flex-grow sm:ms-4">

      <div className="flex flex-col items-center  mb-6 ">
        <div className="relative w-48 h-48">
          {editedShopUser?.image ? (
            <img
              src={`${import.meta.env.VITE_ENDPORTFRONT}/${editedShopUser.image}`}
              alt="Profile img"
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <div className="flex justify-center items-center w-full h-full rounded-full bg-gray-300">
              <FontAwesomeIcon icon={faUserCircle}  className="text-gray-500 text-9xl" />
            </div>
          )}
          <label
            htmlFor="profileImage"
            className="absolute bottom-2  right-2 bg-gray-200 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-300"
          >
          <FontAwesomeIcon icon={faPencilAlt}/>
            <input
              type="file"
              id="profileImage"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      </div>
   
        <form className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Shop Name</label>
              <input
                type="text"
                className={`w-full border ${errors?.shopName ? "border-gray-500" : "border-gray-300"} rounded-md p-2`}
                placeholder="Enter Shop Name"
                value={editedShopUser?.shopName || ''}
                onChange={(e) => handleInputChange("shopName", e.target.value)}
                />
              {errors?.shopName && <span className="text-red-500 text-sm">{errors?.shopName}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium">Owner Name</label>
              <input
                type="text"
                className={`w-full border ${errors?.ownerName ? "border-gray-500" : "border-gray-300"} rounded-md p-2`}
                placeholder="Enter Owner Name"
                value={editedShopUser?.ownerName|| ''}
                onChange={(e) => handleInputChange("ownerName", e.target.value)}
                />
                {errors?.ownerName && <span className="text-red-500 text-sm">{errors?.ownerName}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400">Email <span className="font-thin text-xs">(unable to change)</span></label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
              placeholder="user@example.com"
              value={editedShopUser?.email || ''}
              readOnly
              />
          </div>
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <input
                type="number"
                className={`w-full border ${errors?.phoneNumber ? "border-gray-500" : "border-gray-300"} rounded-md p-2`}
                placeholder="Enter Phone Number Name"
                value={editedShopUser?.phoneNumber|| ''}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                />
                {errors?.phoneNumber && <span className="text-red-500 text-sm">{errors?.phoneNumber}</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">About</label>
            <textarea
              className={`w-full border ${errors?.about ? "border-gray-500" : "border-gray-300"} rounded-md p-2`}
              value={editedShopUser?.about || ''}
              rows={5}
              placeholder="Show users your experience here..."
              onChange={(e) => handleInputChange("about", e.target.value)}
            ></textarea> 
              {errors?.about && <span className="text-red-500 text-sm">{errors?.about}</span>}
          </div>

          <div className="mb-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Location
              </label>

              <MapContainer
                center={[11.875080, 75.373848]}
                zoom={15}
                className="h-72 w-full z-10" >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker onLocationChange={setSelectedLocation}
                initialPosition={shopUserDetails?.location.coordinates? [shopUserDetails.location.coordinates[0],shopUserDetails.location.coordinates[1]] : undefined} />
              </MapContainer>

            </div>
         
          <div className="flex justify-end">
            <button
              type="button" onClick={()=>(setShowConfirmModal(true) )}
              // className="bg-maincol hover:bg-maincoldark text-white px-4 py-2 rounded-md"
              className="btn-primary"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0  bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              Are you sure you want to confirm Edit this Profile?
            </h3>
            <div className="flex items-center justify-end">
              <button
                className="btn-secondary mr-2"
                // className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 mr-2"
                onClick={() => setShowConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                // className="bg-maincol text-white px-4 py-2 rounded-md hover:bg-maincoldark"
                className="btn-primary"
                onClick={handleSaveChanges} >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default EditProfile;

