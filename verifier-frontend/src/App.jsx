import { useEffect, useState } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage.jsx';
import { Signin } from './pages/Signin.jsx';
import { Signup } from './pages/Signup.jsx';
import { User } from './pages/User.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [backendData, setBackendData] = useState([{}]);

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/signin' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/userplaceholder' element={<User />} />
      </Routes>
    </Router>
  );
}

export default App;
