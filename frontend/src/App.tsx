import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Shop from './components/routes/Shop';
import 'react-toastify/dist/ReactToastify.css';
import Admin from './components/routes/Admin';
import User from './components/routes/User';

const App:React.FC = () => {
  return (
    <BrowserRouter>
    <Routes>

      <Route path='/*' element={<User />} />

      <Route path='/shop/*' element={<Shop />} />

      <Route path='/admin/*' element={<Admin />} />
        
    </Routes>
    </BrowserRouter>
  )
}

export default App

