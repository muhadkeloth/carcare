import React, { useCallback, useEffect, useState } from 'react'
import carcare_logo from '../../../assets/images/Car_Care_logo.png'
import { faBars, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLocation, useNavigate } from 'react-router-dom';
import { navigateHome, navigateLogin, navigateLogout, navigateProfile } from '../../utilities/navigate/common';
import { fetchUserData } from '../../../services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../features/userSlice';
import { RootState } from '../../../store';
import { navigateChatHistory, navigateEstimate, navigateFindWorkShop, navigatePickMyCar } from '../../utilities/navigate/userNavigator';
import { HttpStatusCode } from '../../utilities/interface';



const Header:React.FC = () => {
    const [isUserDropdownOpen,setIsUserDropdownOpen] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);
    const userprofile = useSelector((state:RootState)=> state.user.userDetails)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation().pathname;

    const getUserData = useCallback(async () => {
      try {
        const response = await fetchUserData(navigate)
        if(response.status === HttpStatusCode.SUCCESS){          
         dispatch(setUser(response.data.userdet))
        }
      } catch (error) {
        console.error('Failed to fetch userdata:', error);      
      }
    },[dispatch])

    useEffect(() => {
      const token = localStorage.getItem("user_token");
      if(token){
        getUserData()
      }
    },[getUserData])

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 z-50`">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-3 sm:p-4">
        <img src={carcare_logo} className="h-8" alt="carCare" />
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {userprofile ? (
            <button
              type="button"
              className="flex w-8 h-8 text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              onClick={() => {
                setIsUserDropdownOpen((prev) => !prev);
              }}
            >
              {userprofile.image ? (
                <img
                  src={userprofile.image}
                  alt="profile img"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="w-full h-full text-gray-400"
                />
              )}
            </button>
          ) : (
            <button
              className="dark:text-white"
              onClick={() => {
                navigateLogin(navigate, "user");
              }}
            >
              Sign In
            </button>
          )}

          {isUserDropdownOpen && (
            <div className=" absolute z-50 right-2 top-10 my-4  bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600">
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  {userprofile?.username}
                </span>
                <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                  {userprofile?.email}
                </span>
              </div>
              <ul className="py-2">
                <li>
                  <span
                    onClick={() => navigateProfile(navigate)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Profile
                  </span>
                </li>
                {/* <li>
            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Settings</span>
          </li> */}
                <li>
                  <span
                    onClick={() => {
                      navigateLogout(navigate, "user");
                    }}
                    className="block px-4 py-2 text-sm text-gray-700 hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Sign out
                  </span>
                </li>
              </ul>
            </div>
          )}

          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>

        <div
          className={`items-center justify-between ${
            isNavOpen ? "block" : "hidden"
          } w-full md:flex md:w-auto md:order-1`}
          id="navbar-user"
        >
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <button
                onClick={() => navigateHome(navigate, "user")}
                className={`block py-2 px-3 ${
                  location === "/"
                    ? "text-mainclr-700 md:dark:text-mainclr-500"
                    : "text-gray-900 dark:text-white"
                } hover:text-mainclr-700 md:p-0 `}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateFindWorkShop(navigate)}
                className={`block py-2 px-3 ${
                  location === "/findworkshop"
                    ? "text-mainclr-700 md:dark:text-mainclr-500"
                    : "text-gray-900 dark:text-white"
                } hover:text-mainclr-700 md:p-0 `}
              >
                Find WorkShop
              </button>
            </li>
            <li>
              <button
                onClick={() => navigateEstimate(navigate)}
                className={`block py-2 px-3 ${
                  location === "/getEstimate"
                    ? "text-mainclr-700 md:dark:text-mainclr-500"
                    : "text-gray-900 dark:text-white"
                } hover:text-mainclr-700 md:p-0 `}
              >
                Get an Estimate
              </button>
            </li>
            <li>
              <button
                onClick={() => navigatePickMyCar(navigate)}
                className={`block py-2 px-3 ${
                  location === "/pickMyCar"
                    ? "text-mainclr-700 md:dark:text-mainclr-500"
                    : "text-gray-900 dark:text-white"
                } hover:text-mainclr-700 md:p-0 `}
              >
                Pick My Car
              </button>
            </li>
            <li>
              <button
              onClick={() => navigateChatHistory(navigate)}
                className={`block py-2 px-3 ${
                  location == "/chats"
                    ? "text-mainclr-700 md:dark:text-mainclr-500"
                    : "text-gray-900 dark:text-white"
                } hover:text-mainclr-700 md:p-0 `}
              >
                Chat with us
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header