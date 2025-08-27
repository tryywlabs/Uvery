import NavBar from './Components/Navbar.tsx';
import { motion } from 'framer-motion';
import { CustomForm } from './Components/CustomForm.tsx';
import { useNavigate } from 'react-router-dom';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

const signupFields = [
  {
    id: 'username',
    label: 'Institution Name',
    type: 'text',
    placeholder: 'University of Example',
    required: true,
  },
  {
    id: 'email',
    label: 'Institute Email Address',
    type: 'email',
    placeholder: 'your-institution-email@university.edu',
    required: true,
  },
  {
    id: 'password',
    label: 'Create Password',
    type: 'password',
    placeholder: 'Create a secure password',
    required: true,
  },
  {
    id: 'confirmPassword',
    label: 'Confirm password',
    type: 'password',
    placeholder: 'Confirm your password',
    required: true,
  },
  {
    id: 'institutionType',
    label: 'Institution Type',
    type: 'select',
    placeholder: 'Select institution type',
    options: [
      'University',
      'College',
      'Training Institute',
      'Certification Body',
    ],
    required: true,
  },
];

export const Signup = () => {
  const navigate = useNavigate();
  const handleSignupSubmit = async (formData) => {
    console.log('Signup Data:', formData);

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please try again.');
      return;
    }

    try {
      const response = await fetch(`${VITE_API_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password, // Use password field for password
          institutionType: formData.institutionType,
        }),
      });

      const data = await response.json();
      console.log('Signup Response:', data);

      if (response.ok) {
        alert('Signup successful! Please sign in to continue.');
        // Navigate to signin page after successful signup
        navigate('/signin');
      } else if (
        data.errorMessage ==
        'Invalid education domain. Please use a valid institution email address.'
      ) {
        alert('Invalid email domain. Please use a valid institution email.');
      } else {
        alert(data.errorMessage || 'Signup failed. Please try again.');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Network error. Please check your connection and try again.');
    }
  };

  return (
    <div id='signupMain' className='bg-zinc-100 min-h-screen'>
      <NavBar></NavBar>
      <motion.h1
        className='py-15 px-15 text-black font-bold'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        custom={1}
      >
        Sign Up as an Institution
      </motion.h1>

      <motion.h2
        className='px-15 text-black'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        custom={2}
      >
        Sign up to our service as an <strong>Institution</strong>, and begin
        your journey to securing integrity for your certificates!
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
            fields={signupFields}
            submitButtonText='Sign Up'
            onSubmit={handleSignupSubmit}
            linkButton={{
              text: 'Already have an account? Sign In',
              href: '/signin',
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
