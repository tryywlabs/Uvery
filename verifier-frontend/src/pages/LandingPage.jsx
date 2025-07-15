import { useState, useEffect } from 'react';
import NavBar from './Components/Navbar.tsx';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { CustomButton as Button } from './Components/CustomButton.tsx';
import { CustomCard } from './Components/CustomCard.tsx';

// Fade in animation variants
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

const logoVariants = {
  initial: { opacity: 1, scale: 1.5 },
  animate: {
    opacity: [1, 0, 1], // blink 2 times, end on visible
    scale: 1.5,
    transition: {
      duration: 1.2,
      times: [0.2, 0.7, 1],
      ease: 'easeInOut',
    },
  },
  exit: { opacity: 0, scale: 1.5, transition: { duration: 0.5 } },
};

//Landing page component
// This component serves as the landing page for the application, showcasing the main features and purpose of Uvery
const LandingPage = () => {
  //Show logo upon initial load for 1.5 seconds
  const [showLogo, setShowLogo] = useState(true);

  // Show logo for 1.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogo(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='flex flex-col min-h-screen'>
      <AnimatePresence>
        {showLogo && (
          <motion.div className='fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white z-50'>
            <motion.img
              src='src/assets/Uvery.svg'
              alt='Uvery Logo'
              className='h-20 sm:h-20 rounded transition'
              initial='initial'
              animate='animate'
              exit='exit'
              variants={logoVariants}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Default Landing page after the Animation */}
      {!showLogo && (
        <>
          {/* Navigation Bar */}
          <NavBar></NavBar>
          <main className='flex-grow flex-col items-center !bg-zinc-100 px-4'>
            <section className='w-[30vw] flex flex-col items-start py-16'>
              <motion.h1
                className='text-5xl font-extrabold mb-10 text-gray-900'
                initial='hidden'
                animate='visible'
                variants={fadeIn}
                custom={1}
              >
                Securely handle your Candidate Credentials
              </motion.h1>
              <motion.p
                className='text-lg text-gray-700 mb-8 py-10'
                initial='hidden'
                animate='visible'
                variants={fadeIn}
                custom={2}
              >
                <strong>Uvery</strong> is a blockchain-based verification tool
                for companies and HR to verify candidate certifications, and
                Universities to give out securely verifiable certifications.{' '}
                <br />{' '}
              </motion.p>
              <motion.p
                className='text-lg text-gray-700 mb-8'
                initial='hidden'
                animate='visible'
                variants={fadeIn}
                custom={3}
              >
                We offer our service for <strong>Verifiers</strong> like hirers
                seeking to verify a candidate's academic credentials, <br /> or
                <strong> Academic Institutions</strong> to deliver Verifiable
                Certificates on Uvery.
              </motion.p>
            </section>
            <motion.section
              className='flex flex-col items-center justify-center w-[90vw] max-w-6x1 mx-auto p-12 bg-fuchsia-100 rounded-lg shadow-lg'
              initial='hidden'
              animate='visible'
              variants={fadeIn}
              custom={4}
            >
              <div className='w-full flex flex-col sm:flex-row gap-8 justify-center mt-6'>
                {/* Verifier Form */}
                <div className='flex-1 bg-white rounded-md p-7 border border-gray-200 shadow text-gray-800 flex flex-col py-15'>
                  <h3 className='text-lg font-bold mb-2'>For Verifiers</h3>
                  <ol className='list-decimal list-inside mb-4 text-gray-700 space-y-2 text-sm'>
                    <li>Upload Candidate Certificates</li>
                    <li>Wait until we search for a Matching Hash</li>
                    <li>Receive and view the results directly</li>
                  </ol>
                  <div className='mt-auto flex justify-center'>
                    <Button
                      variant='outline'
                      className='mx-auto bg-white text-white px-8 py-3 rounded-lg font-semibold shadow hover:opacity-0.1 transition'
                    >
                      Verify Now
                    </Button>
                  </div>
                </div>
                {/* Institution Form */}
                <div className='flex-1 bg-white rounded-md p-7 border border-gray-200 shadow text-gray-800 py-15'>
                  <h3 className='text-lg font-bold mb-2'>For Institutions</h3>
                  <ol className='list-decimal list-inside mb-4 text-gray-700 space-y-2 text-sm'>
                    <li>Sign Up as an Institution</li>
                    <li>
                      Enter in the Candidate Details to Generate a Certificate
                    </li>
                    <li>OR Upload a Certificate</li>
                    <li>Send out the Certificates via Email</li>
                  </ol>
                  <div className='mt-auto flex justify-center'>
                    <Button
                      variant='outline'
                      className='mx-auto bg-white text-white px-8 py-3 rounded-lg font-semibold shadow hover:opacity-0.1 transition'
                    >
                      Sign Up as an Institution
                    </Button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* About Section */}
            <section id='about' className='py-20'>
              <h1 className='py-15 text-black font-bold'>About Uvery</h1>
              <div className='flex flex-col md:flex-row justify-center items-stretch gap-10 max-w-6x1 mx-auto px-4'>
                <CustomCard
                  title='Peer-to-peer Verification'
                  description='We offer a decentralised cryptographic verification of issued certificates, with no centralised storate of critical information or the certificates themselves'
                  className='!bg-emerald-200 !border-zinc-200 w-full md:w-1/3'
                  image='src/pages/AboutIcons/magnifying-glass.png'
                ></CustomCard>
                <CustomCard
                  title='Streamlined Process for Hirers'
                  description='Instead of having to contact the institution, we allow hirers to verify the authenticity of a candidate’s certificate in seconds'
                  className='!bg-teal-200 !border-zinc-200 w-full md:w-1/3'
                  image='src/pages/AboutIcons/clock.png'
                ></CustomCard>
                <CustomCard
                  title='Automate Certificate Issuance'
                  description='Our platform offers much more for universities and academic institutes; start issuing and distributing certificates securely and quickly'
                  className='!bg-violet-200 !border-zinc-200 w-full md:w-1/3'
                  image='src/pages/AboutIcons/edit-text.png'
                ></CustomCard>
              </div>
            </section>

            {/* FAQ Section */}
            <section id='faqs'>
              <h1 className='py-15 text-black font-bold'>FAQs</h1>
            </section>

            {/* Contact Section */}
            <section id='contact'>
              <h1 className='py-15 text-black font-bold'>Contacts</h1>
            </section>

            {/* Footer Section */}
            <section></section>
          </main>
        </>
      )}
    </div>
  );
};

export default LandingPage;
