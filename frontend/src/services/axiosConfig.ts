import axios from "axios"
import store from "../store";
import { clearUser } from "../features/userSlice";


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
    // const currentRoute = window.location.pathname;
    let token: string|null = null;
    let endpoint = '/login';
    
    // const publicRoutes = [
    //     '/login','/signup','/otpgenerate','/otpvalidation','/resetPassword','/getnearshops',
    //     '/admin/login','/admin/otpgenerate','/admin/otpvalidation','/admin/resetPassword',
    //     '/shop/login','/shop/otpgenerate','/shop/otpvalidation','/shop/resetPassword'
    // ];

    // if(publicRoutes.includes(currentRoute)){return config};

    if(config.url?.startsWith('/admin')){
        token = localStorage.getItem('admin_token');
        endpoint = '/admin/login';
    }else if(config.url?.startsWith('/shop')){
        token = localStorage.getItem('shop_token');
        endpoint = '/shop/login';
    }else{
        token =localStorage.getItem('user_token');
        endpoint = '/login'
    }

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }else{
        window.location.href = endpoint;        
    }

    if(config.url && config.url == '/admin/addShop'){
        config.headers['Content-Type'] = 'multipart/form-data'
    }
    
    return config;
},(error) => {
    return Promise.reject(error);
});



api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response?.status == 403){
            const currentRoute = window.location.pathname;
            let logoutUrl = 'user';

            if(currentRoute.startsWith('/admin')){
                logoutUrl = 'admin';
            }else if(currentRoute.startsWith('/shop')){
                logoutUrl = 'shop';
            }else{
                store.dispatch(clearUser())
            }

            localStorage.removeItem(`${logoutUrl}_token`);
            window.location.href = logoutUrl == 'user' ? '/login':`/${logoutUrl}/login`;
        }
        return Promise.reject(error);
    }
)

export default api;

