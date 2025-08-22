import NavBar from './Components/Navbar.tsx';
import { motion } from 'framer-motion';
import { CustomForm } from './Components/CustomForm.tsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Components/AuthProvider.jsx';
import { useEffect } from 'react';
import { apiCall } from '../utils/connection.js';

// Fade in animation variants
// This animation will fade in elements with a slight upward motion
const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      type: 'spring',
      stiffness: 100,
      damping: 20,
    },
  }),
};

const signinFields = [
  {
    id: 'email',
    label: 'Institution Email Address',
    type: 'email',
    placeholder: 'example@example.edu',
    required: true,
  },
  {
    id: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password',
    required: true,
  },
];

export const Signin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading, user } = useAuth();

  // Move useEffect OUTSIDE of handleSigninSubmit
  useEffect(() => {
    if (!loading && isAuthenticated) {
      console.log('User already authenticated, redirecting to user page');
      navigate(`/${user.username || user.institutionName}`);
    }
  }, [isAuthenticated, loading, navigate, user]);

  // Show loading while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }

  // Don't show signin form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleSigninSubmit = async (formData) => {
    console.log('Signin Data:', formData);

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/users/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log('Signin Response:', data);

      if (response.ok) {
        login(data.user, data.token);
        console.log('Signin successful:', data);
        const user = data.user;
        navigate(`/${user.username || user.institutionName}`);
      } else {
        alert(data.errorMessage || 'Sign in failed. Please try again.');
      }
    } catch (error) {
      console.error('Signin failed:', error);
      alert('Network error. Please check your connection and try again.');
    }
  }; // FIXED: Proper function closing

  return (
    <div id='signinMain' className='bg-zinc-100 min-h-screen'>
      <NavBar />
      <motion.h1
        className='py-15 px-15 text-black font-bold'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        custom={1}
      >
        Sign In as an Institution
      </motion.h1>

      <motion.h2
        className='px-15 text-black'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        custom={2}
      >
        Sign into our service as an <strong>Institution</strong> to upload
        certificates
      </motion.h2>

      <div
        id='signinContent'
        className='flex flex-col items-center justify-center py-40 w-full'
      >
        <motion.div
          id='signinForm'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          custom={3}
          className='flex w-full max-w-4xl'
        >
          <CustomForm
            fields={signinFields}
            submitButtonText='Sign In'
            onSubmit={handleSigninSubmit}
            showRememberMe={true}
            showForgotPassword={true}
            secondaryButton={{
              text: 'Sign Up as a Verified Institution',
              onClick: () => navigate('/signup'),
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
