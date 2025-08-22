import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';
import { CustomButton } from './CustomButton.tsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthProvider.jsx';

export default function NavBar() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user, loading } = useAuth();

  // Debug logging
  // console.log('Navbar - isAuthenticated:', isAuthenticated);
  // console.log('Navbar - user:', user);
  // console.log('Navbar - loading:', loading);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
      navigate('/');
    } else {
      navigate('/signin');
    }
  };

  const handleHome = () => {
    if (isAuthenticated) {
      navigate(`/${user.username || user.institutionName}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Navbar fluid className='!bg-zinc-100 py-2'>
      <NavbarBrand>
        <img
          src='/assets/Uvery.svg'
          className='ml-10 mr-4 h-20 sm:h-20 rounded cursor-pointer hover:brightness-90 transition'
          alt='Uvery Logo'
          onClick={() => navigate('/')}
        />
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse className='flex items-center justify-center space-x-8 font-sans'>
        <NavbarLink
          className='flex items-center text-lg !font-semibold !text-gray-700 hover:text-blue-600 transition cursor-pointer'
          onClick={handleHome}
          active
        >
          {isAuthenticated ? 'Dashboard' : 'Home'}
        </NavbarLink>
        <NavbarLink
          className='flex items-center text-lg !font-semibold !text-gray-700 hover:text-blue-600 transition'
          href='/#about'
        >
          About
        </NavbarLink>
        <NavbarLink
          className='flex items-center text-lg !font-semibold !text-gray-700 hover:text-blue-600 transition'
          href='/#faqs'
        >
          FAQs
        </NavbarLink>
        <NavbarLink
          className='flex items-center text-lg !font-semibold !text-gray-700 hover:text-blue-600 transition'
          href='/#contact'
        >
          Contact Us
        </NavbarLink>
        <CustomButton onClick={handleAuthAction}>
          {isAuthenticated ? 'Logout' : 'Sign In for Institutions'}
        </CustomButton>
      </NavbarCollapse>
    </Navbar>
  );
}
