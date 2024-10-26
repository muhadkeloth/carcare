import React from 'react'
import { useLocation } from 'react-router-dom'

const AdminDash: React.FC = () => {
    const location = useLocation()
    const pathName:string = location.pathname.split('/')[1]
    
  return (
    <div>
        somethigneree:
        <p>Current URL Path: {pathName}</p>

    </div>
  )
}

export default AdminDash