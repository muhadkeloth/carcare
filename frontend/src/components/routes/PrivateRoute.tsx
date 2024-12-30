import React from 'react'
import { RoleProps } from '../utilities/interface'
import { isAuthenticated } from '../utilities/functions'
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { navigateLogin } from '../utilities/navigate/common';

const PrivateRoute = ({role}:RoleProps) => {
    const isAuth = isAuthenticated(role);

    if(!isAuth){
        const loginPath = role === 'user' || role === 'userSign' || !role
        ? '/login'
        : `/${role}/login`;
        return <Navigate to={loginPath} replace />;
        // return navigateLogin(navigate,role)
    }
  return <Outlet />
}

export default PrivateRoute