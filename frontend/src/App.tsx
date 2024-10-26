import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import './App.css'
import Home from './components/user/Home';
import AdminDash from './components/admin/AdminDash';

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Login />} />
      <Route path='/admin/login' element={<Login />} />
      <Route path='/admin/dash' element={<AdminDash />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
