import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Layout from '@/components/Layout/DashboardLayout';
import { validateRefreshToken } from '@/utils/authUtils';
import { useSignalR } from '@/hooks/useSignalR';
import { fetchMe } from '@/store/slices/meSlice';
import type { AppDispatch } from '@/store/store';
import Logo from '@/assets/Logo.jpg';
import { Loader2 } from 'lucide-react';

const LoadingPage = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Initialize SignalR connection when authorized
  useSignalR(isAuthorized === true);

  useEffect(() => {
    const handler = () => navigate('/login', { replace: true });
    window.addEventListener('force-logout', handler);
    return () => window.removeEventListener('force-logout', handler);
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      // Validate session using HTTP-only cookie
      const response = await validateRefreshToken();
      if (response !== null) {
        // Fetch user data after successful authentication
        await dispatch(fetchMe());
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    };

    // Give time for cookie to be set after login
    const timer = setTimeout(() => {
      checkAuth();
    }, 50);

    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (isAuthorized === false) {
      navigate('/login', { replace: true });
    }
  }, [isAuthorized, navigate]);

  if (isAuthorized === null) {
    return (
      <div className='flex flex-col justify-center items-center h-screen'>
        <img
          src={Logo}
          alt='Company Logo'
          className='w-32 h-32 object-contain'
          style={{ animation: 'bw-pulse 2.5s infinite' }}
        />
        <Loader2 className='mt-8 h-8 w-8 animate-spin text-gray-800' />
      </div>
    );
  }

  return (
    <>
      <Layout />
    </>
  );
};

export default LoadingPage;
