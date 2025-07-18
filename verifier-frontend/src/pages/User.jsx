import NavBar from './Components/Navbar.tsx';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { CustomButton as Button } from './Components/CustomButton.tsx';
import { CustomCard } from './Components/CustomCard.tsx';
import { CustomForm } from './Components/CustomForm.tsx';
import { useNavigate } from 'react-router-dom';

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
  return (
    <div id='userMain' className='bg-zinc-100 min-h-screen'>
      <NavBar></NavBar>
      <motion.h1
        className='py-15 px-15 text-black font-bold'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        custom={1}
      >
        Welcome, UserName
      </motion.h1>

      <motion.h2
        className='px-15 text-black'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        custom={2}
      >
        Upload your certificate, send to student!
      </motion.h2>
    </div>
  );
};
