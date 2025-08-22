import { useEffect, useState } from 'react';
import './App.css';
import { LandingPage } from './pages/LandingPage.jsx';
import { Signin } from './pages/Signin.jsx';
import { Signup } from './pages/Signup.jsx';
import { User } from './pages/User.jsx';
import { Verify } from './pages/Verify.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './pages/Components/AuthProvider.jsx';

function App() {
  const [backendData, setBackendData] = useState([{}]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/:username' element={<User />} />
          <Route path='/verify' element={<Verify />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
