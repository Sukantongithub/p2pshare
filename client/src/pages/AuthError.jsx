import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const AuthError = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get('error') || 'Authentication failed';

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow max-w-md">
        <h1 className="text-xl font-semibold text-red-600 mb-3">FebBox Login Error</h1>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default AuthError;
