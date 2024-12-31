import axios from "axios"
import store from "../store";
import { clearUser } from "../features/userSlice";
import { HttpStatusCode } from "../components/utilities/interface";
import { fetchRefreshToken } from "./apiCall";


const api = axios.create({
    baseURL:import.meta.env.VITE_ENDPORTFRONT,
    headers: {
        'Content-Type':'application/json',
    }
});


api.interceptors.request.use((config) => {
    const publicRoutes = [
        '/user/login','/signup','/signupOtpGenerate','/otpgenerate','/otpvalidation','/resetPassword','/getnearshops',
        '/admin/login','/admin/otpgenerate','/admin/otpvalidation','/admin/resetPassword',
        '/shop/login','/shop/otpgenerate','/shop/otpvalidation','/shop/resetPassword'
    ];
    if(config.url && publicRoutes.includes(config.url))return config;
    let token: string|null = null;
    let endpoint = '/login';
    
    if(config.url?.startsWith('/admin/')){
        token = localStorage.getItem('admin_access_token');
        endpoint = '/admin/login';
    }else if(config.url?.startsWith('/shop/')){
        token = localStorage.getItem('shop_access_token');
        endpoint = '/shop/login';
    }else{
        token =localStorage.getItem('user_access_token');
        endpoint = '/login'
    }

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }else{
        window.location.href = endpoint;        
    }

    const urlForm = [
      "/uploadprofileimage",
      "/admin/addShop",
      "/shop/uploadprofileimage",
      "/saveImageMessage",
      "/shop/saveImageMessage",
    ];

    if(config.url && urlForm.includes(config.url) ){
        config.headers['Content-Type'] = 'multipart/form-data'
    }
    
    return config;
},(error) => Promise.reject(error)
);



api.interceptors.response.use(
    (response) => response,
    async (error) => {     
        const originalRequest = error.config;   
        if(error.response?.status == HttpStatusCode.FORBIDDEN){
            const currentRoute = window.location.pathname;
            let logoutUrl = 'user';
            if(currentRoute.startsWith('/admin')){
                logoutUrl = 'admin';
            }else if(currentRoute.startsWith('/shop')){
                logoutUrl = 'shop';
            }else{
                store.dispatch(clearUser())
            }
            localStorage.removeItem(`${logoutUrl}_access_token`);
            localStorage.removeItem(`${logoutUrl}_refresh_token`);
            // window.location.href = `/${logoutUrl}/login`;
        }else if(error.response?.status === HttpStatusCode.UNAUTHORIZED){
            const currentRoute = window.location.pathname;
            let role = 'user';
            if(currentRoute.startsWith('/admin')){
                role = 'admin';
            }else if(currentRoute.startsWith('/shop')){
                role = 'shop';
            }
            try {
                const refreshToken = localStorage.getItem(`${role}_refresh_token`)
                if (!refreshToken) {
                    throw new Error("Refresh token not available");
                }
                const refreshResponse = await fetchRefreshToken(`/${role}/refreshToken`, refreshToken);
                const newAccessToken = refreshResponse.data.accessToken;
                localStorage.setItem(`${role}_access_token`,newAccessToken);
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (error) {
                localStorage.removeItem(`${role}_access_token`);
                localStorage.removeItem(`${role}_refresh_token`);
                window.location.href = `/${role}/login`;                
            }
        }
        return Promise.reject(error);
    }
)


export default api;

