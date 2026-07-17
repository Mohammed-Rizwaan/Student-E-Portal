import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { KeyRound, User, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export const Login = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      toast.error("Please enter both User ID and Password");
      return;
    }

    setIsSubmitting(true);
    // Simulate a brief API call duration
    setTimeout(() => {
      const res = login(userId, password);
      setIsSubmitting(false);

      if (res.success) {
        toast.success("Welcome back!");
        // Navigation guards will automatically route based on role, 
        // but we can explicitly trigger routing here for immediate feedback.
        const savedUser = JSON.parse(localStorage.getItem('mentorconnect_user'));
        if (savedUser?.role === 'mentor') {
          navigate('/mentor/dashboard', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    }, 800);
  };

  const handleFillCredentials = (uid, pass) => {
    setUserId(uid);
    setPassword(pass);
  };

  const handleResetData = () => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('mentorconnect_')) {
        localStorage.removeItem(key);
      }
    });
    // Also clear the user session to be clean
    localStorage.removeItem('mentorconnect_user');
    toast.success("Demo system data reset to defaults! Reloading...");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      {/* Brand logo details */}
      <div className="mb-6 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white font-extrabold text-xl shadow-lg shadow-blue-500/10">
          MC
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 tracking-tight">PVKK Student E-Portal</h2>
        <p className="text-sm text-gray-500 font-medium">Digital Student Management System</p>
      </div>

      {/* Main Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        <h3 className="text-lg font-bold text-gray-900 mb-2">Sign In</h3>
        <p className="text-xs text-gray-500 mb-6">Enter your academic credentials to access your dashboard.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              User ID
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <User size={16} />
              </div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="mentor01 or 229X1A0501"
                className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <KeyRound size={16} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-10 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/10 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:bg-blue-800 disabled:bg-blue-400 transition-colors"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </motion.div>

      {/* Demo Credentials Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-full max-w-md mt-6 rounded-xl border border-blue-100 bg-blue-50/50 p-5"
      >
        <div className="flex gap-2 items-center text-blue-800 mb-3">
          <ShieldAlert size={16} />
          <h4 className="text-xs font-bold uppercase tracking-wider">Demo Login Credentials</h4>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-xs">
          {/* Mentor */}
          <div className="rounded-lg bg-white/75 p-3 border border-blue-100/50">
            <p className="font-bold text-gray-800 mb-1">Mentor Account</p>
            <p className="text-gray-500">ID: <code className="font-semibold text-blue-700">bhagya01</code></p>
            <p className="text-gray-500">Pass: <code className="font-semibold text-blue-700">mentor123</code></p>
            <button
              onClick={() => handleFillCredentials('bhagya01', 'mentor123')}
              className="mt-2 text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all"
            >
              Autofill Mentor
            </button>
          </div>

          {/* Student */}
          <div className="rounded-lg bg-white/75 p-3 border border-blue-100/50">
            <p className="font-bold text-gray-800 mb-1">Student Account</p>
            <p className="text-gray-500">ID: <code className="font-semibold text-blue-700">243N6A05B4</code></p>
            <p className="text-gray-500">Pass: <code className="font-semibold text-blue-700">student123</code></p>
            <button
              onClick={() => handleFillCredentials('243N6A05B4', 'student123')}
              className="mt-2 text-[10px] font-bold text-blue-600 hover:text-blue-800 hover:underline transition-all"
            >
              Autofill Student
            </button>
          </div>
        </div>

        <p className="mt-3.5 text-center text-[10px] italic text-gray-400">
          "These credentials are provided for demonstration purposes only."
        </p>
        
        <div className="mt-4 pt-3 border-t border-blue-100/50 flex justify-center">
          <button
            type="button"
            onClick={handleResetData}
            className="text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline transition-all"
          >
            Clear Local Cache & Reset System Data
          </button>
        </div>
      </motion.div>
    </div>
  );
};
