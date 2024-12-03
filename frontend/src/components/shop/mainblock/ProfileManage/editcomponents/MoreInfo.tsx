import React, { useState } from 'react'
import { ThreeDots } from 'react-loader-spinner'
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { shopProfile } from '../../../../../features/shopSlice';
import { ToastActive } from '../../../../utilities/functions';
import { nameValidation } from '../../../../utilities/validation';
import { fetchUpdateProfileDetails } from '../../../../../services/shopService';

const MoreInfo:React.FC = () => {
  const shopUserDetails = useSelector((state:RootState)=> state.shop.shopDetails)
  const [editedShopUser, setEditedShopUser] = useState<{title:string;discript:string;about:string}>({
    title:shopUserDetails?.discription?.title || '',discript:shopUserDetails?.discription?.discript || '',about:shopUserDetails?.about || ''
  });
  const [errors, setErrors] = useState<{ [key: string]:string }|null>(null);
  const [isLoading,setIsLoading] = useState(false);


  const handleSaveChanges = async () => {
    let flag = false;
    setEditedShopUser((prev)=>({
      title:prev.title.trim(),discript:prev.discript.trim(),about:prev.about.trim()
    }))
    setErrors(null);
    if(!editedShopUser) {ToastActive('error','error occured'); return;};
    if(!editedShopUser?.title || nameValidation(editedShopUser?.title)){
      setErrors((prev) => ({...prev,title:'discript title is required.'}))
      flag = true;
    } 
    if(!editedShopUser?.discript || editedShopUser?.discript.length < 10 ){
      setErrors((prev) => ({...prev,discript:'Discript is required and least 10 characters.'}))
      flag = true;
    } 
    if(!editedShopUser?.about || editedShopUser?.about.length < 10 ){
      setErrors((prev) => ({...prev,about:'About is required and least 10 characters.'}))
      flag = true;
    } 
    if(flag)return;
    
    try {
      setIsLoading(true);
      const response = await fetchUpdateProfileDetails('/shop/updateprofileinfo',editedShopUser);
      if(response.data.success){
        ToastActive('success',"shop details updated successfully");
      }else{
        ToastActive('error','failed to update shop details.')
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      ToastActive('error',errorMessage)
    }finally{
      setIsLoading(false);
    }
  }


  return (
    <div className="flex flex-col sm:flex-row my-6 sm:mx-4">
      <div className="flex flex-col flex-grow sm:ms-4">   
        <form className="space-y-4">
          <div className="">
            <div>
              <label className="block text-sm font-medium">Discription Title</label>
              <input
                type="text"
                className={`w-full border ${errors?.title ? "border-gray-500" : "border-gray-300"} rounded-md p-2`}
                placeholder="Enter Shop Name"
                value={editedShopUser?.title || ''}
                onChange={(e) => setEditedShopUser((prev)=>({...prev,title:e.target.value}))}
                />
              {errors?.title && <span className="text-red-500 text-sm">{errors?.title}</span>}
            </div>
          </div>        

          <div>
            <label className="block text-sm font-medium">Discription</label>
            <textarea
              className={`w-full border ${errors?.discript ? "border-gray-500" : "border-gray-300"} rounded-md p-2`}
              value={editedShopUser?.discript || ''}
              rows={5}
              placeholder="Show users your message here..."
              onChange={(e) => setEditedShopUser((prev)=>({...prev,discript:e.target.value}))}
            ></textarea> 
              {errors?.discript && <span className="text-red-500 text-sm">{errors?.discript}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium">About</label>
            <textarea
              className={`w-full border ${errors?.about ? "border-gray-500" : "border-gray-300"} rounded-md p-2`}
              value={editedShopUser?.about || ''}
              rows={5}
              placeholder="Show users your experience here..."
              onChange={(e) => setEditedShopUser((prev)=>({...prev,about:e.target.value}))}
            ></textarea> 
              {errors?.about && <span className="text-red-500 text-sm">{errors?.about}</span>}
          </div>

          <div className="flex justify-end">
            <button
              type="button" onClick={handleSaveChanges}
              className="btn-primary"
            >
              { isLoading ? <ThreeDots height="" color='white' wrapperClass="w-10 h-6" /> : 'Save Changes' }
            </button>
          </div>
        </form>
      </div>




    </div>
  )
}

export default MoreInfo