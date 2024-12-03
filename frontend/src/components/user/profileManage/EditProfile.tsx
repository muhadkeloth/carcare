import { faPencilAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store'
import { ThreeDots } from 'react-loader-spinner'
import { setUser, userProfile } from '../../../features/userSlice'
import { emailValidation, handleInputValue, nameValidation, phoneNumberValidation } from '../../utilities/validation'
import { ToastActive } from '../../utilities/functions'
import { HttpStatusCode } from '../../utilities/interface'
import { fetchUserUpdateProfileDetails, fetchUserUploadProfileImage } from '../../../services/userService'

const EditProfile:React.FC = () => {
    const userDetails = useSelector((state:RootState) => state.user.userDetails);
    const [editedUser,setEditedUser] = useState<userProfile|null>(userDetails)
    const [imageIsLoading,setImageIsLoading] = useState(false);
    const [isLoading,setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]:string }|null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const dispatch = useDispatch();


    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {          
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append("image", file);        
          try {
            setImageIsLoading(true);
            const response = await fetchUserUploadProfileImage(formData)
            if(response.status !== HttpStatusCode.CREATED) throw new Error('failed to upload image.');
              handleInputChange('image',response.data.imagePath);
              ToastActive('success','Image updated successfully.');
          } catch (error) {
            ToastActive('error','error uploading image.')
          }finally{
            setImageIsLoading(false);
          }
        }
      };

      const handleSaveChanges = async () => {
        setShowConfirmModal(false)
        let flag = false;
        setErrors(null);
        if(!editedUser) {ToastActive('error','error occured'); return;};
        if(!editedUser?.username || nameValidation(editedUser?.username)){
          setErrors((prev) => ({...prev,shopName:' Name is required.'}))
          flag = true;
        } 
        if(!editedUser?.email || !emailValidation(editedUser?.email)){
          setErrors((prev) => ({...prev,email:'Email is required.'}))
          flag = true;
        } 
        if(!editedUser?.phoneNumber || phoneNumberValidation(editedUser?.phoneNumber)){
          setErrors((prev) => ({...prev,phoneNumber:'Phone Number is required.'}))
          flag = true;
        } 
        if(flag)return;
        
        const changesMade = JSON.stringify(editedUser) !== JSON.stringify(userDetails);
        if(!changesMade){ToastActive('info','No changes applied.');return;};
        
        try {
          setIsLoading(true);
          const response = await fetchUserUpdateProfileDetails(editedUser);
          if(response.data.success){
            dispatch(setUser(response.data.updatedUser))
            ToastActive('success'," details updated successfully");
          }else{
            ToastActive('error','failed to update  details.')
          }
        } catch (error) {
          const errorMessage = (error as Error).message;
          ToastActive('error',errorMessage)
        }finally{
          setIsLoading(false);
        }
      }

      const handleInputChange = (key: keyof userProfile, value: any) => {
        setEditedUser((prev)=> (prev ? {...prev, [key]:value} : null));
      }



  return (
    <div className="flex-1 p-1 sm:p-2 bg-gray-100 ">
      
    <div className="p-4">
    <h2 className="text-2xl font-bold ms-1 mt-1 mb-4 pe-1 text-gray-800">
      Edit Profile Management
    </h2>

        <div className="container mx-auto p-4">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="overflow-x-auto">
          <div className="flex flex-col sm:flex-row my-6 sm:mx-4">
  <div className="flex flex-col flex-grow sm:ms-4">

  <div className="flex flex-col items-center  mb-6 ">
    <div className="relative w-48 h-48">
      {editedUser?.image ? (
        <img
          src={editedUser.image}
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
      { imageIsLoading ? <ThreeDots height="" color='black' wrapperClass="w-10 h-6" /> : <FontAwesomeIcon icon={faPencilAlt}/> } 
        <input
          type="file"
          id="profileImage"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
    </div>
  </div>

<form className="flex justify-center">
  <div className="space-y-6 w-96">
    <div>
      <label className="block text-sm font-medium">Profile Name</label>
      <input
        type="text"
        className={`w-full border ${errors?.username ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
        placeholder="Enter Shop Name"
        value={editedUser?.username || ''}
        onChange={(e) => handleInputChange("username", e.target.value)}
      />
      {errors?.username && <span className="text-red-500 text-sm">{errors?.username}</span>}
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-400">
        Email
      </label>
      <input
        type="email"
        className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 cursor-not-allowed"
        placeholder="user@example.com"
        value={editedUser?.email || ''}
        readOnly
      />
    </div>

    <div>
      <label className="block text-sm font-medium">Phone Number</label>
      <input
        type="text"
        className={`w-full border ${errors?.phoneNumber ? "border-red-500" : "border-gray-300"} rounded-md p-2`}
        placeholder="Enter Phone Number"
        value={editedUser?.phoneNumber || ''}
        onChange={(e) => handleInputValue(e, 10) && handleInputChange("phoneNumber", e.target.value)}
      />
      {errors?.phoneNumber && <span className="text-red-500 text-sm">{errors?.phoneNumber}</span>}
    </div>

    <div>
      <button
        type="button"
        className="w-full btn-primary"
        onClick={() => setShowConfirmModal(true)}
      >
        {isLoading ? (
          <ThreeDots height="" color="white" wrapperClass="w-10 h-6" />
        ) : (
          'Save Changes'
        )}
      </button>
    </div>
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
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </button>
          <button
            className="btn-primary"
            onClick={handleSaveChanges} >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )}


</div>
          </div>
        </div>
      </div>
      {/* )} */}
  
</div>
</div>
  )
}

export default EditProfile