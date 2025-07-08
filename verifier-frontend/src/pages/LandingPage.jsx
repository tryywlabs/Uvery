import NavBar from './Navbar.tsx';

const LandingPage = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar />
      <main className='flex-grow flex-col items-center !bg-gradient-to-b from-zinc-100 to-zinc-400 px-4'>
        {/* Hero Section */}
        <section className='w-[30vw] flex flex-col items-start py-16'>
          <h1 className='text-5xl font-extrabold mb-10 text-gray-900'>
            Securely handle your Candidate Credentials
          </h1>
          <p className='text-lg text-gray-700 mb-8'>
            <strong>Uvery</strong> is a blockchain-based verification tool for
            companies and HR to verify candidate certifications, and
            Universities to give out securely verifiable certifications. <br />{' '}
            We offer our service for <strong>Verifiers</strong> like hirers
            seeking to verify a candidate's academic credentials, <br /> or
            <strong> Academic Institutions</strong> to deliver Verifiable
            Certificates on Uvery.
          </p>
        </section>
        <section>
          <div className='w-full flex flex-col sm:flex-row gap-4 justify-center mt-6'>
            <button className='bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition'>
              Get Started
            </button>
            <button className='bg-white border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition'>
              Learn More
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
