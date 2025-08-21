import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { pageVariants, pageTransition } from '../animations';
import { authAPI } from '../services/api';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setVerificationStatus('error');
      setMessage('No verification token found. Please ensure you clicked the full link from your email.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        setVerificationStatus('success');
        setMessage(response.data.message || 'Your email has been successfully verified! You can now log in.');
        setTimeout(() => {
          navigate('/login?verified=true');
        }, 3000);
      } catch (err: any) {
        setVerificationStatus('error');
        setMessage(err.response?.data?.message || 'Email verification failed. The link may be invalid or expired.');
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-md w-full space-y-8 text-center">
        <Link to="/" className="inline-block mb-8">
          <img
            className="h-12 w-auto"
            src={theme === 'dark' ? '/images/logos/clickbit-logo-single-color-light.png' : '/images/logos/Click Bit Logo Vec Full.png'}
            alt="ClickBit"
            loading="eager"
          />
        </Link>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Email Verification
        </h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          {verificationStatus === 'loading' && (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1FBBD2] mb-4"></div>
              <p className="text-lg text-gray-700 dark:text-gray-300">Verifying your email...</p>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="flex flex-col items-center text-green-600 dark:text-green-400">
              <CheckCircle className="h-16 w-16 mb-4" />
              <p className="text-lg font-semibold mb-2">Verification Successful!</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
              <Link to="/login" className="mt-4 font-medium text-[#1FBBD2] hover:text-[#1c9aa8] transition-colors">
                Go to Login
              </Link>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="flex flex-col items-center text-red-600 dark:text-red-400">
              <XCircle className="h-16 w-16 mb-4" />
              <p className="text-lg font-semibold mb-2">Verification Failed</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
              <Link to="/register" className="mt-4 font-medium text-[#1FBBD2] hover:text-[#1c9aa8] transition-colors">
                Try Registering Again
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default VerifyEmailPage;
