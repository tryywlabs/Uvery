import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from 'flowbite-react';

export default function NavBar() {
  return (
    <Navbar fluid className='!bg-zinc-100 !text-white'>
      <NavbarBrand>
        <img
          src='src/assets/Uvery.svg'
          className='ml-10 mr-4 h-20 sm:h-20 rounded cursor-pointer hover:brightness-90 transition'
          alt='Uvery Logo'
          onClick={() => window.location.reload()}
        />
      </NavbarBrand>
      <NavbarToggle />
      <NavbarCollapse className='flex items-center space-x-6'>
        <NavbarLink className='text-black' href='#' active>
          Home
        </NavbarLink>
        <NavbarLink className='text-grey-600' href='#'>
          About
        </NavbarLink>
        <NavbarLink href='#'>FAQs</NavbarLink>
        <NavbarLink href='#'>Contact Us</NavbarLink>
        <button className='hover:brightness-150 transition'>
          <NavbarLink className='!text-white' href='#'>
            Sign in for Institutions
          </NavbarLink>
        </button>
      </NavbarCollapse>
    </Navbar>
  );
}
