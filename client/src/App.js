
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './Pages/Home/Home';
import Register from './Pages/Register/Register';
import { useEffect } from 'react';
import axios from './axios/axios';
import LoginPage from './Pages/Login/LoginPage';

function App() {
  const navigate = useNavigate ()
  const checkuser = async () => {
    try {
      await axios.get('./users/check',{
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })

      console.log(data)
      
    } catch (error) {
      console.log(error)
          navigate("/login");
    }
  }

  
  useEffect(()=>{
    checkuser()
  },[])
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </div>
  );
}

export default App;
