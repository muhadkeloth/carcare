import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import './App.css'
import Home from './components/Home';

function App() {


  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<Login />} />
    </Routes>

    </BrowserRouter>
  )
}

export default App
