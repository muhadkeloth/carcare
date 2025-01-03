import React, { useState } from 'react'
import { ThreeDots } from 'react-loader-spinner';
import { ToastActive } from '../../utilities/functions';
import { passwordConfirmValidation, passwordValidation } from '../../utilities/validation';
import { changePasswordUser } from '../../../services/userService';
import { DropMotionWrapper } from '../../reuseComponents/ui/MotionWrapper ';

const ChangePassword:React.FC = () => {
    const [input,setInput] = useState({password:'',newPassword:'',confirmPassword:''});
    const [error,setError] = useState<Record<string,string> | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError(null)
        const passwordvalidation = passwordValidation(input.password)
        if(typeof passwordvalidation == 'string'){
          setError((prev) => ({...prev,passError:passwordvalidation}))
          return;
        } 
        const newPasswordvalidation = passwordValidation(input.newPassword)
        if(typeof newPasswordvalidation == 'string'){
          setError((prev) => ({...prev,newpassError:newPasswordvalidation}))
          return;
        } 
        if(input.confirmPassword.length === 0 || passwordConfirmValidation(input.newPassword,input.confirmPassword)){
          setError((prev) => ({...prev,confirmPasswordError:'password mismatch or required'}))
          return;
        }
        setIsLoading(true);
    
        try {
          const response = await changePasswordUser({currentPassword:input.password, newPassword:input.newPassword});
          if (response.data?.success) ToastActive('success',"Password changed successfully.");
        } catch (error) {
          const errorMessage = (error as Error).message;
          ToastActive('error',errorMessage)
        } finally {
          setIsLoading(false);
        }
      }


  return (
    <div className="flex-1 p-1 sm:p-2 bg-gray-100 ">
      <div className="p-4">
        <h2 className="text-2xl font-bold ms-1 mt-1 mb-4 pe-1 text-gray-800">
          Change Password
        </h2>
        <div className="container mx-auto p-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="overflow-x-auto">
              <div className="flex flex-col sm:flex-row my-6 sm:mx-4">
                <div className="flex flex-col flex-grow sm:ms-4 items-center">
                  <form onSubmit={handleSubmit} className="w-1/3 space-y-4">
                    <DropMotionWrapper>
                      <label className="block text-sm font-medium">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="••••••"
                        value={input.password}
                        onChange={(e) =>
                          setInput({ ...input, password: e.target.value })
                        }
                      />
                      {error?.passError && (
                        <span className="text-red-500">{error?.passError}</span>
                      )}
                    </DropMotionWrapper>
                    <DropMotionWrapper>
                      <label className="block text-sm font-medium">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="••••••"
                        value={input.newPassword}
                        onChange={(e) =>
                          setInput({ ...input, newPassword: e.target.value })
                        }
                      />
                      {error?.newpassError && (
                        <span className="text-red-500">
                          {error?.newpassError}
                        </span>
                      )}
                    </DropMotionWrapper>
                    <DropMotionWrapper>
                      <label className="block text-sm font-medium">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="w-full border border-gray-300 rounded-md p-2"
                        placeholder="••••••"
                        value={input.confirmPassword}
                        onChange={(e) =>
                          setInput({ ...input, confirmPassword: e.target.value,})
                        }
                      />
                      {error?.confirmPasswordError && (
                        <span className="text-red-500">
                          {error?.confirmPasswordError}
                        </span>
                      )}
                    </DropMotionWrapper>
                    <DropMotionWrapper>
                    <button type="submit" disabled={isLoading} className="w-full btn-primary">
                      {isLoading ? (
                        <div className="flex justify-center items-center  w-full">
                          <ThreeDots height="" color="white" wrapperClass="w-10 h-6"/>
                        </div>
                      ) : (
                        "Change Password"
                      )}
                    </button>
                    </DropMotionWrapper>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword