import React, { useState } from 'react';

export function CertificateUpload() {
  const [file, setFile] = useState(null);
  const [studentEmail, setStudentEmail] = useState('');
  const [certificateType, setCertificateType] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !studentEmail || !certificateType) {
      setMessage('Please fill in all fields and select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('certificate', file);
    formData.append('studentEmail', studentEmail);
    formData.append('certificateType', certificateType);

    try {
      const response = await fetch(
        'http://localhost:8000/api/certificate/upload-certificate',
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        setMessage('Certificate uploaded successfully!');
      } else {
        setMessage(
          data.errorMessage || 'Error uploading certificate. Please try again.'
        );
      }
    } catch (error) {
      setMessage('Response Error: ' + error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      encType='multipart/form-data'
      className='max-w-md mx-auto p-4 bg-zinc-300 shadow-md rounded'
    >
      <div>
        <label className='block mb-2 font-medium text-gray-700'>
          Upload Certificate:
        </label>
        <input
          type='file'
          name='certificate'
          accept='.pdf'
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
      </div>
      <div>
        <label className='block mb-2 text-sm font-medium text-gray-700 py-2'>
          Student Email:
        </label>
        <input
          type='email'
          placeholder='Student Email'
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          required
          className='text-gray-800 bg-white border border-gray-300 rounded-md p-2'
        />
      </div>
      <div>
        <label className='block mb-2 text-sm font-medium text-gray-700 py-2'>
          Certificate Type:
        </label>
        <select
          value={certificateType}
          onChange={(e) => setCertificateType(e.target.value)}
          className='text-gray-800 bg-white border border-gray-300 rounded-md p-2'
        >
          <option value=''>Select Certificate Type</option>
          <option value='bachelor'>Bachelor</option>
          <option value='PGT'>PGT</option>
          <option value='PGR'>PGR</option>
          <option value='PHD'>PHD</option>
          <option value='Diploma'>Diploma</option>
          required
        </select>
      </div>
      <button
        type='submit'
        className='mt-4 bg-blue-500 text-white py-2 px-4 rounded align-middle transition duration-200'
      >
        Upload Certificate
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
