import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';
import { CustomButton } from './Components/CustomButton.tsx';

export default function NavBar() {
  return (
    <Navbar fluid className='!bg-zinc-100 py-2'>
      <NavbarBrand>
        <img
          src='src/assets/Uvery.svg'
          className='ml-10 mr-4 h-20 sm:h-20 rounded cursor-pointer hover:brightness-90 transition'
          alt='Uvery Logo'
          onClick={() => window.location.reload()}
        />
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse className='flex items-center justify-center space-x-8 font-sans'>
        <NavbarLink
          className='flex items-center text-lg !font-semibold !text-gray-700 hover:text-blue-600 transition'
          href='#'
          active
        >
          Home
        </NavbarLink>
        <NavbarLink
          className='flex items-center text-lg !font-semibold !text-gray-700 hover:text-blue-600 transition'
          href='#about'
        >
          About
        </NavbarLink>
        <NavbarLink
          className='flex items-center text-lg !font-semibold !text-gray-700 hover:text-blue-600 transition'
          href='#faqs'
        >
          FAQs
        </NavbarLink>
        <NavbarLink
          className='flex items-center text-lg !font-semibold !text-gray-700 hover:text-blue-600 transition'
          href='#contact'
        >
          Contact Us
        </NavbarLink>
        <CustomButton>Sign in for Institutions</CustomButton>
      </NavbarCollapse>
    </Navbar>
  );
}
