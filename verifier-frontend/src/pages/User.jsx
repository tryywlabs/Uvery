/*
 * User Dashbooard Page
 */

import NavBar from './Components/Navbar.tsx';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { useAuth } from './Components/AuthProvider.jsx';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CertificateUpload } from './Components/Upload.jsx';

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

export const User = () => {
  const { username } = useParams();
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const userIdentifier = user.username || user.institutionName;
      if (username !== userIdentifier) {
        navigate(`/${userIdentifier}`);
      } else if (username == 'verify') {
        navigate('/verify');
      }
    }
  }, [loading, isAuthenticated, user, username, navigate]);

  // return (
  //   <div id='userMain' className='bg-zinc-100 min-h-screen'>
  //     <NavBar></NavBar>
  //     <motion.h1
  //       className='py-15 px-15 text-black font-bold'
  //       initial='hidden'
  //       animate='visible'
  //       variants={fadeIn}
  //       custom={1}
  //     >
  //       Welcome, {user.username || user.institutionName}!
  //     </motion.h1>

  //     <motion.h2
  //       className='px-15 text-black'
  //       initial='hidden'
  //       animate='visible'
  //       variants={fadeIn}
  //       custom={2}
  //     >
  //       Upload your certificate, send to student!
  //     </motion.h2>
  //     <motion.div
  //       className='px-15 py-5'
  //       initial='hidden'
  //       animate='visible'
  //       variants={fadeIn}
  //       custom={3}
  //     >
  //       <p className='text-gray-600'>
  //         Institution: {user.institutionName || user.username}
  //       </p>
  //       <p className='text-gray-600'>Email: {user.email}</p>
  //       <p className='text-gray-600'>Type: {user.institutionType}</p>
  //     </motion.div>
  //     <motion.div
  //       className='px-15 py-5'
  //       initial='hidden'
  //       animate='visible'
  //       variants={fadeIn}
  //       custom={4}
  //     >
  //       <CertificateUpload />
  //     </motion.div>
  //   </div>
  // );

  return (
    <div id='userMain' className='bg-zinc-100 min-h-screen'>
      <NavBar />
      <div className='flex flex-col md:flex-row justify-center items-start gap-8 px-8 py-12'>
        {/* Left: Welcome and user info */}
        <div className='flex-1 min-w-[300px]'>
          <motion.h1
            className='text-black font-bold text-2xl mb-4'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
            custom={1}
          >
            Welcome, {user.username || user.institutionName}!
          </motion.h1>
          <motion.h2
            className='text-black mb-2'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
            custom={2}
          >
            Upload your certificate, send to student!
          </motion.h2>
          <motion.div
            className='mb-4'
            initial='hidden'
            animate='visible'
            variants={fadeIn}
            custom={3}
          >
            <p className='text-gray-600'>
              Institution: {user.institutionName || user.username}
            </p>
            <p className='text-gray-600'>Email: {user.email}</p>
            <p className='text-gray-600'>Type: {user.institutionType}</p>
          </motion.div>
        </div>
        {/* Right: Upload form */}
        <motion.div
          className='flex-1 min-w-[350px]'
          initial='hidden'
          animate='visible'
          variants={fadeIn}
          custom={4}
        >
          <CertificateUpload />
        </motion.div>
      </div>
    </div>
  );
};
