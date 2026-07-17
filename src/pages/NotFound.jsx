import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (currentUser) {
      if (currentUser.role === 'mentor') {
        navigate('/mentor/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-md shadow-blue-500/5">
        <Compass size={32} />
      </div>
      
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Page Not Found
      </h1>
      
      <p className="mt-3 text-center text-sm text-gray-500 max-w-md leading-relaxed">
        We couldn't find the page you are looking for. It may have been moved, deleted, or does not exist.
      </p>

      <button
        onClick={handleGoBack}
        className="mt-8 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/10 hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>
    </div>
  );
};
