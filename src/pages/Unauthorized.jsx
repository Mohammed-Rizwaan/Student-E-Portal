import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldX, ArrowLeft } from 'lucide-react';

export const Unauthorized = () => {
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
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-indigo-100 px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-md shadow-red-500/5">
        <ShieldX size={32} />
      </div>
      
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Access Denied
      </h1>
      
      <p className="mt-3 text-center text-sm text-gray-500 max-w-md leading-relaxed">
        You do not have the required permissions to view this page. This action has been logged and restricted.
      </p>

      <button
        onClick={handleGoBack}
        className="mt-8 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-blue-500/10 hover:bg-blue-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Return to Safety
      </button>
    </div>
  );
};
