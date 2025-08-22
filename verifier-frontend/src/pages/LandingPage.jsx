import { useState, useEffect } from 'react';
import NavBar from './Components/Navbar.tsx';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { CustomButton as Button } from './Components/CustomButton.tsx';
import { CustomCard } from './Components/CustomCard.tsx';
import { CustomFooter } from './Components/CustomFooter.tsx';
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

//Logo animation variants
// This animation will make the logo blink twice before disappearing
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
export const LandingPage = () => {
  //Show logo upon initial load for 1.5 seconds
  const [showLogo, setShowLogo] = useState(true);

  const navigate = useNavigate();

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
              src='/assets/Uvery.svg'
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
              className='flex flex-col items-center justify-center w-[90vw] max-w-6xl mx-auto p-12 rounded-lg shadow-lg'
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
                      onClick={() => navigate('/verify')}
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
                      onClick={() => navigate('/signup')}
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
                  className='!bg-gray-300 !border-zinc-200 w-full md:w-1/3'
                  image='/assets/AboutIcons/magnifying-glass.png'
                ></CustomCard>
                <CustomCard
                  title='Streamlined Process for Hirers'
                  description='Instead of having to contact the institution, we allow hirers to verify the authenticity of a candidate’s certificate in seconds'
                  className='!bg-zinc-300 !border-zinc-200 w-full md:w-1/3'
                  image='/assets/AboutIcons/clock.png'
                ></CustomCard>
                <CustomCard
                  title='Automate Certificate Issuance'
                  description='Our platform offers much more for universities and academic institutes; start issuing and distributing certificates securely and quickly'
                  className='!bg-slate-300 !border-zinc-200 w-full md:w-1/3'
                  image='/assets/AboutIcons/edit-text.png'
                ></CustomCard>
              </div>
            </section>

            {/* FAQ Section */}
            <section id='faqs'>
              <h1 className='py-15 text-black font-bold'>FAQs</h1>

              <div className='space-y-6 px-4 text-black'>
                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h3 className='text-xl font-semibold mb-2'>
                    What is blockchain verification?
                  </h3>
                  <p className='text-gray-700'>
                    Blockchain verification uses distributed ledger technology
                    to create tamper-proof records of certificates. This means
                    once a certificate is registered, it cannot be altered,
                    providing a secure and transparent verification method.
                  </p>
                </div>

                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h3 className='text-xl font-semibold mb-2'>
                    How secure is Uvery's platform?
                  </h3>
                  <p className='text-gray-700'>
                    Uvery employs industry-standard security practices including
                    encryption, secure hashing algorithms, and blockchain
                    technology. We don't store the actual certificates, only
                    cryptographic hashes, ensuring maximum privacy and security.
                  </p>
                </div>

                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h3 className='text-xl font-semibold mb-2'>
                    Can any institution join Uvery?
                  </h3>
                  <p className='text-gray-700'>
                    We verify all institutions before onboarding to maintain
                    platform integrity. Eligible institutions include accredited
                    universities, colleges, certification bodies, and recognized
                    educational organizations.
                  </p>
                </div>

                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h3 className='text-xl font-semibold mb-2'>
                    How long does verification take?
                  </h3>
                  <p className='text-gray-700'>
                    Most verifications happen within seconds. The system quickly
                    checks the uploaded certificate against our blockchain
                    records and provides immediate results.
                  </p>
                </div>

                <div className='bg-white rounded-lg shadow-md p-6'>
                  <h3 className='text-xl font-semibold mb-2'>
                    Is there a cost to verify certificates?
                  </h3>
                  <p className='text-gray-700'>
                    Basic verification is completely free for recruiters and
                    hiring managers. Institutions have various subscription
                    plans based on their certificate issuance volume.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section id='contact' className='py-16 bg-zinc-100 w-full py-10'>
              <div className='max-w-6xl mx-auto px-4'>
                <h1 className='py-15 text-black font-bold'>Contacts</h1>

                <div className='flex flex-col md:flex-row gap-10'>
                  <div className='md:w-1/2'>
                    <h3 className='text-xl font-semibold mb-4 text-black'>
                      Contact Information
                    </h3>
                    <div className='space-y-4'>
                      <div className='flex items-start'>
                        <svg
                          className='h-6 w-6 mr-3 text-gray-600'
                          xmlns='http://www.w3.org/2000/svg'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='currentColor'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                          />
                        </svg>
                        <div>
                          <p className='font-medium'>Email</p>
                          <p className='text-gray-600'>ywhur99@gmail.com</p>
                        </div>
                      </div>
                    </div>

                    <div className='mt-8'>
                      <h4 className='font-medium mb-3'>Follow Us</h4>
                      <div className='flex space-x-4'>
                        <a
                          href='#'
                          className='text-gray-600 hover:text-gray-900'
                        >
                          <span className='sr-only'>Twitter</span>
                          <svg
                            className='h-6 w-6'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                            aria-hidden='true'
                          >
                            <path d='M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84' />
                          </svg>
                        </a>
                        <a
                          href='#'
                          className='text-gray-600 hover:text-gray-900'
                        >
                          <span className='sr-only'>LinkedIn</span>
                          <svg
                            className='h-6 w-6'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                            aria-hidden='true'
                          >
                            <path d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z' />
                          </svg>
                        </a>
                        <a
                          href='#'
                          className='text-gray-600 hover:text-gray-900'
                        >
                          <span className='sr-only'>GitHub</span>
                          <svg
                            className='h-6 w-6'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                            aria-hidden='true'
                          >
                            <path
                              fillRule='evenodd'
                              d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
                              clipRule='evenodd'
                            />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className='md:w-1/2 mt-8 md:mt-0'>
                    <form className='bg-white p-6 rounded-lg shadow-md'>
                      <h3 className='text-xl font-semibold mb-4 text-black'>
                        Send Us a Message
                      </h3>

                      <div className='grid grid-cols-1 gap-6'>
                        <div>
                          <label
                            htmlFor='name'
                            className='block text-sm font-medium text-gray-700 mb-1'
                          >
                            Name
                          </label>
                          <input
                            type='text'
                            id='name'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                        </div>

                        <div>
                          <label
                            htmlFor='email'
                            className='block text-sm font-medium text-gray-700 mb-1'
                          >
                            Email
                          </label>
                          <input
                            type='email'
                            id='email'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                        </div>

                        <div>
                          <label
                            htmlFor='subject'
                            className='block text-sm font-medium text-gray-700 mb-1'
                          >
                            Subject
                          </label>
                          <input
                            type='text'
                            id='subject'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          />
                        </div>

                        <div>
                          <label
                            htmlFor='message'
                            className='block text-sm font-medium text-gray-700 mb-1'
                          >
                            Message
                          </label>
                          <textarea
                            id='message'
                            rows='4'
                            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          ></textarea>
                        </div>

                        <div>
                          <Button
                            variant='outline'
                            className='w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition'
                          >
                            Send Message
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer Section */}
            <section>
              <CustomFooter className='bg-gray-100' />
            </section>
          </main>
        </>
      )}
    </div>
  );
};

export default LandingPage;
