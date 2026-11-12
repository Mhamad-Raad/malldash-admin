import { useState, useEffect } from 'react';
import { DemoLoginBox } from '@/demo/DemoLoginBox';
import { DEMO_ACCOUNTS } from '@/demo/server';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { showValidationErrors } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import { loginUser, forgotPassword } from '@/data/Authorization';
import { validateRefreshToken } from '@/utils/authUtils';
import { setAccessToken } from '@/store/slices/notificationsSlice';
import Logo from '@/assets/Logo.jpg';

import { setMe } from '@/store/slices/meSlice';


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');

  useEffect(() => {
    const checkSession = async () => {
      // Try to validate session using HTTP-only cookie
      const isValid = await validateRefreshToken();
      if (isValid) {
        navigate('/');
        return;
      }
      setIsCheckingSession(false);
    };
    checkSession();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsLoading(true);

    try {
      const response = await loginUser({ email, password });
      if (response.error || response.errors?.length > 0) {
        showValidationErrors(
          'Login Failed',
          response.errors?.length > 0 ? response.errors : response.error,
          'Email or password is incorrect'
        );
        setIsLocked(true);
      } else {
        // Store the access token for SignalR connection
        if (response.accessToken || response.token) {
          dispatch(setAccessToken(response.accessToken || response.token));
        }
        dispatch(setMe(response));
        toast.success('Login successful!');
        navigate('/');
      }
    } catch (error: any) {
      toast.error('Server is down or unreachable!');
      setIsLocked(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      if (isLocked) setIsLocked(false);
    };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    forgotPassword(forgotPasswordEmail)
      .then((response) => {
        if (response.error || response.errors?.length > 0) {
          showValidationErrors(
            'Request Failed',
            response.errors?.length > 0 ? response.errors : response.error,
            'Unable to process password reset request'
          );
        } else {
          toast.success(`Password reset link has been sent to ${forgotPasswordEmail}`);
          setShowForgotPassword(false);
          setForgotPasswordEmail('');
        }
      })
      .catch(() => {
        toast.error('Server is down or unreachable!');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isCheckingSession) {
    return (
      <div className='flex flex-col justify-center items-center h-screen bg-neutral-950'>
        <div className='absolute inset-0 w-full h-full z-0'>
           <BackgroundBeams />
        </div>
        <div className='relative z-10 flex flex-col items-center'>
            <img
            src={Logo}
            alt='Company Logo'
            className='w-32 h-32 object-contain'
            style={{ animation: 'bw-pulse 2.5s infinite' }}
            />
            <Loader2 className='mt-8 h-8 w-8 animate-spin text-white' />
        </div>
      </div>
    );
  }

  return (
    <div className='w-full h-screen lg:grid lg:grid-cols-2 relative bg-neutral-950'>
      
       {/* Global Background Beams container - spanning both columns */}
       <div className='absolute inset-0 w-full h-full z-0 pointer-events-none'>
           <BackgroundBeams />
       </div>

      {/* Left Column: Branding / Marketing */}
      <div className='hidden lg:flex flex-col justify-between p-10 text-white relative z-10 bg-transparent'>
        
        <div className='relative z-10 flex items-center gap-3 font-medium text-lg'>
          <div className='h-10 w-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center overflow-hidden border border-white/20 shadow-xl'>
            <img src={Logo} alt='Logo' className='h-full w-full object-cover' />
          </div>
          <span className='text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent'>MallDash</span>
        </div>
        
        <div className='relative z-10 mt-auto'>
          <blockquote className='space-y-4'>
            <p className='text-xl italic font-light leading-relaxed text-zinc-200'>
              &ldquo;Streamline your system management operations with real-time insights and comprehensive control.&rdquo;
            </p>
            <footer className='text-sm font-medium text-zinc-400 flex items-center gap-2'>
              <div className='h-px w-8 bg-zinc-600' />
              Admin Console
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column: Login Form */}
      <div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Mobile Logo (visible only on small screens) */}
        <div className='absolute top-4 left-4 lg:hidden flex items-center gap-2'>
           <div className='h-8 w-8 bg-zinc-100 rounded-md flex items-center justify-center overflow-hidden'>
            <img src={Logo} alt='Logo' className='h-full w-full object-contain' />
          </div>
          <span className='font-bold text-white'>Mall Dash</span>
        </div>

        <div className='mx-auto grid w-full max-w-[400px] gap-8'>
          {!showForgotPassword ? (
            // Login Form
            <>
              <div className='flex flex-col space-y-2 text-center'>
                <h1 className='text-3xl font-bold tracking-tight text-white'>Welcome back</h1>
                <p className='text-zinc-400 text-lg'>
                  Enter your credentials to access your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className='grid gap-6'>
                <DemoLoginBox
                  email={DEMO_ACCOUNTS.admin.email}
                  password={DEMO_ACCOUNTS.admin.password}
                  onFill={() => {
                    setEmail(DEMO_ACCOUNTS.admin.email);
                    setPassword(DEMO_ACCOUNTS.admin.password);
                    setIsLocked(false);
                  }}
                />
            <div className='grid gap-3'>
              <Label htmlFor='email' className='text-base text-zinc-300 ml-1'>Email</Label>
              <div className='relative group'>
                <Input
                  id='email'
                  type='email'
                  placeholder='name@example.com'
                  required
                  value={email}
                  onChange={handleChange(setEmail)}
                  className='pl-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/10 focus:border-primary/50 focus:ring-0 rounded-xl transition-all duration-300'
                />
                <Mail className='absolute left-4 top-4 h-6 w-6 text-zinc-500 group-hover:text-primary transition-colors duration-300' />
              </div>
            </div>

            <div className='grid gap-3'>
              <div className='flex items-center justify-between ml-1'>
                <Label htmlFor='password' className='text-base text-zinc-300'>Password</Label>
                <button
                  type='button'
                  className='text-sm font-medium text-primary hover:text-primary/80 underline-offset-4 hover:underline transition-colors'
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>
              <div className='relative group'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••'
                  required
                  value={password}
                  onChange={handleChange(setPassword)}
                  className='pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/10 focus:border-primary/50 focus:ring-0 rounded-xl transition-all duration-300'
                />
                <Lock className='absolute left-4 top-4 h-6 w-6 text-zinc-500 group-hover:text-primary transition-colors duration-300' />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors duration-300'
                >
                  {showPassword ? (
                    <EyeOff className='h-6 w-6' />
                  ) : (
                    <Eye className='h-6 w-6' />
                  )}
                </button>
              </div>
            </div>

            <Button type='submit' className='w-full h-14 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl bg-primary hover:bg-primary/90' disabled={isLoading || isLocked}>
              {isLoading && <Loader2 className='mr-2 h-5 w-5 animate-spin' />}
              {isLocked ? 'Please edit credentials' : 'Sign In'}
            </Button>
          </form>

          <p className='px-8 text-center text-sm text-zinc-500'>
             By clicking continue, you agree to our{' '}
            <a href='#' className='underline underline-offset-4 hover:text-primary transition-colors text-zinc-400'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='#' className='underline underline-offset-4 hover:text-primary transition-colors text-zinc-400'>
              Privacy Policy
            </a>
            .
          </p>
          </>
          ) : (
            // Forgot Password Form
            <>
              <div className='flex flex-col space-y-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordEmail('');
                  }}
                  className='w-fit bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white group'
                >
                  <ArrowLeft className='mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300' />
                  Back to login
                </Button>
                <div className='text-center mt-2'>
                  <h1 className='text-3xl font-bold tracking-tight text-white'>Forgot Password</h1>
                  <p className='text-zinc-400 text-lg mt-2'>
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>
              </div>

              <form onSubmit={handleForgotPassword} className='grid gap-6'>
                <div className='grid gap-3'>
                  <Label htmlFor='forgot-email' className='text-base text-zinc-300 ml-1'>Email</Label>
                  <div className='relative group'>
                    <Input
                      id='forgot-email'
                      type='email'
                      placeholder='name@example.com'
                      required
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className='pl-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/10 focus:border-primary/50 focus:ring-0 rounded-xl transition-all duration-300'
                    />
                    <Mail className='absolute left-4 top-4 h-6 w-6 text-zinc-500 group-hover:text-primary transition-colors duration-300' />
                  </div>
                </div>

                <Button type='submit' className='w-full h-14 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl bg-primary hover:bg-primary/90' disabled={isLoading}>
                  {isLoading && <Loader2 className='mr-2 h-5 w-5 animate-spin' />}
                  Send Reset Link
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

    </div>
  );
};

export default Login;
