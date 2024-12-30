import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchUserData } from "../../../services/userService";
import { HttpStatusCode } from "../../utilities/interface";
import { setUser } from "../../../features/userSlice";


const useFetchUserData = (navigate:any) => {
    const dispatch = useDispatch();

  useEffect(() => {
    (async ()=> {
        try {
            const response = await fetchUserData(navigate)
            if(response.status === HttpStatusCode.SUCCESS){
                dispatch(setUser(response.data.userdet));
            }
        } catch (error) {
            console.error('failed to fetch userdata:',error)
        }
    })();
  },[dispatch]);
}

export default useFetchUserData