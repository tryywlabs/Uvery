import React, { useState } from 'react';
import { motion } from 'framer-motion';
import NavBar from './Components/Navbar.tsx';
import { CustomButton as Button } from './Components/CustomButton.tsx';
import { CertDetails } from './Components/CertDetails.jsx';

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

function CertificateVerifier() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, loading, success, fail
  const [message, setMessage] = useState('');
  const [certificate, setCertificate] = useState(null);

  const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please upload a certificate file');
      setStatus('fail');
      return;
    }
    setStatus('loading');
    setMessage('');
    const formData = new FormData();
    formData.append('certificate', file);

    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/certificate/verify-certificate`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      //Display messages based on response
      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Certificate verified successfully');
        setCertificate(data.certificate);
      } else {
        setStatus('fail');
        setMessage(data.errorMessage || 'Verification failed');
        setCertificate(null);
      }
    } catch (error) {
      setStatus('fail');
      setMessage('Network error: ' + error.message);
    }
  };

  function renderStatus() {
    if (status === 'loading') {
      return (
        <div className='flex items-center justify-center mt-4'>
          <span className='animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mr-2'></span>
          <span className='text-blue-600 font-medium'>Verifying...</span>
        </div>
      );
    }
    if (status === 'success') {
      return (
        <div className='mt-4 text-center font-medium text-green-600 border border-green-300 bg-green-50 rounded p-3'>
          <span>✅ {message}</span>
          <CertDetails certificate={certificate} />
        </div>
      );
    }
    if (status === 'fail') {
      return (
        <div className='mt-4 text-center font-medium text-red-600 border border-red-300 bg-red-50 rounded p-3'>
          <span>❌ {message}</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className='flex justify-center items-center min-h-[60vh] px-6'>
      <form
        onSubmit={handleSubmit}
        className='w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg p-8 px-6 flex flex-col gap-4'
      >
        <h2 className='text-xl font-bold mb-6 text-center text-gray-800'>
          Verify Certificate
        </h2>
        <input
          type='file'
          name='certificate'
          accept='.pdf'
          onChange={(e) => setFile(e.target.files[0])}
          required
          className='block w-full text-gray-700 border border-gray-300 rounded px-6 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400'
        />
        <Button
          type='submit'
          className='w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition'
        >
          Verify Certificate
        </Button>
        {renderStatus()}
      </form>
    </div>
  );
}

export const Verify = () => {
  return (
    <div>
      <NavBar />
      <motion.div
        className='div'
        animate='visible'
        initial='hidden'
        variants={fadeIn}
        custom={1}
      >
        <h1 className='text-3xl text-black px-10 font-bold'>Verify Page</h1>
      </motion.div>

      <motion.div
        className='flex justify-left items-left px-10 py-6 text-gray-800'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        custom={2}
      >
        <p>
          <strong>Upload</strong> certificates you received from candidates here
          to verify their authenticity.
        </p>
      </motion.div>

      <motion.div
        className='flex justify-center items-center min-h-[20vh] px-6'
        initial='hidden'
        animate='visible'
        variants={fadeIn}
        custom={3}
      >
        <CertificateVerifier />
      </motion.div>
    </div>
  );
};
