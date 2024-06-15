import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Register from './Pages/Register/Register';
import { useEffect, useState, createContext } from 'react';
import axios from './axios/axios';
import LoginPage from './Pages/Login/LoginPage';
import AskQuestionPage from './Pages/AskQuestionPage/AskQuestionPage';
import RegisterPage from './Pages/Register/RegisterPage';
import QDetailnAnswerPage from './Pages/QDetailAndAnswerPage/QDetailAndAnswerPage';
import UserProfile from './Pages/Profile/UserProfile';
import ErrorPage from './Pages/ErrorPage/ErrorPage';

export const UserContext = createContext();

function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // Initialize with null to indicate no user

  const checkUser = async () => {
    try {
      const { data } = await axios.get('/users/check', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log("Data:", data);
      setUser(data); // Set the entire user data object
  
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  }

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ask-questions" element={<AskQuestionPage />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/question-detail/:id" element={<QDetailnAnswerPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<ErrorPage error="Page not found" />} />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;