import React from 'react';

export function CertDetails({ certificate }) {
  if (!certificate) {
    return null;
  }

  return (
    <div className='certificate-details'>
      <h2 className='text-lg font-semibold mb-4'>Certificate Details</h2>
      <div id='details' className='text-left px-6'>
        <p>
          <strong>Certificate ID:</strong> {certificate.certificateId}
        </p>
        <p>
          <strong>Student Email:</strong> {certificate.studentEmail}
        </p>
        <p>
          <strong>Certificate Type:</strong> {certificate.certificateType}
        </p>
      </div>
    </div>
  );
}
