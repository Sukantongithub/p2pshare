import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { userAPI } from '../utils/api';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    const userId = searchParams.get('userId');
    if (!token) {
      setError('Missing token in callback');
      return;
    }

    const completeLogin = async () => {
      try {
        // Temporarily set token cookie so profile request is authorized
        document.cookie = `authToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
        const res = await userAPI.getProfile();
        const user = res.data?.user || { id: userId, username: 'FebBox User' };
        login(user, token);
        navigate('/files');
      } catch (e) {
        setError('Failed to fetch profile after login');
      }
    };

    completeLogin();
  }, [searchParams, login, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow">Completing login…</div>
    </div>
  );
};

export default AuthSuccess;
