import { RoleProps } from '../utilities/interface'
import { isAuthenticated } from '../utilities/functions'
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({role}:RoleProps) => {
    const isAuth = isAuthenticated(role);

    if(!isAuth){
        const loginPath = role === 'user' || role === 'userSign' || !role
        ? '/login'
        : `/${role}/login`;
        return <Navigate to={loginPath} replace />;
    }
  return <Outlet />
}

export default PrivateRoute