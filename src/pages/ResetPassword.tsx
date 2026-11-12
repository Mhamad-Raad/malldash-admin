import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { Eye, EyeOff, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '@/data/Authorization';
import Logo from '@/assets/Logo.jpg';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Password validation
  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>\-_+=[\]\\/'`~;]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const passwordsMatch = newPassword === confirmPassword && confirmPassword !== '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error('Password does not meet all requirements');
      return;
    }

    if (!passwordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword({ 
        email: email as string, 
        token: token as string, 
        newPassword 
      });
      
      if (response.error || response.errors?.length > 0) {
        toast.error(response.error || response.errors?.[0] || 'Failed to reset password');
        return;
      }
      
      setIsSuccess(true);
      toast.success('Password reset successfully!');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className='flex flex-col justify-center items-center h-screen bg-neutral-950'>
        <div className='absolute inset-0 w-full h-full z-0'>
          <BackgroundBeams />
        </div>
        <div className='relative z-10 text-center'>
          <h1 className='text-2xl font-bold text-white mb-4'>Invalid Reset Link</h1>
          <p className='text-zinc-400 mb-6'>This password reset link is invalid or has expired.</p>
          <Button onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className='flex flex-col justify-center items-center h-screen bg-neutral-950'>
        <div className='absolute inset-0 w-full h-full z-0'>
          <BackgroundBeams />
        </div>
        <div className='relative z-10 text-center'>
          <CheckCircle2 className='h-16 w-16 text-green-500 mx-auto mb-4' />
          <h1 className='text-2xl font-bold text-white mb-4'>Password Reset Successful!</h1>
          <p className='text-zinc-400 mb-6'>Redirecting you to login...</p>
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
          <span className='text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent'>Mall Dash</span>
        </div>
        
        <div className='relative z-10 mt-auto'>
          <blockquote className='space-y-4'>
            <p className='text-xl italic font-light leading-relaxed text-zinc-200'>
              &ldquo;Secure your account with a strong password to protect your mall management operations.&rdquo;
            </p>
            <footer className='text-sm font-medium text-zinc-400 flex items-center gap-2'>
              <div className='h-px w-8 bg-zinc-600' />
              Security First
            </footer>
          </blockquote>
        </div>
      </div>

      {/* Right Column: Reset Password Form */}
      <div className='flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10'>
        {/* Mobile Logo (visible only on small screens) */}
        <div className='absolute top-4 left-4 lg:hidden flex items-center gap-2'>
           <div className='h-8 w-8 bg-zinc-100 rounded-md flex items-center justify-center overflow-hidden'>
            <img src={Logo} alt='Logo' className='h-full w-full object-contain' />
          </div>
          <span className='font-bold text-white'>Mall Dash</span>
        </div>

        <div className='mx-auto grid w-full max-w-[400px] gap-8'>
          <div className='flex flex-col space-y-2 text-center'>
            <h1 className='text-3xl font-bold tracking-tight text-white'>Reset Your Password</h1>
            <p className='text-zinc-400 text-lg'>
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className='grid gap-6'>
            <div className='grid gap-3'>
              <Label htmlFor='new-password' className='text-base text-zinc-300 ml-1'>New Password</Label>
              <div className='relative group'>
                <Input
                  id='new-password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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

            <div className='grid gap-3'>
              <Label htmlFor='confirm-password' className='text-base text-zinc-300 ml-1'>Confirm Password</Label>
              <div className='relative group'>
                <Input
                  id='confirm-password'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='pl-12 pr-12 h-14 bg-white/5 border-white/10 text-white placeholder:text-zinc-500 focus:bg-white/10 focus:border-primary/50 focus:ring-0 rounded-xl transition-all duration-300'
                />
                <Lock className='absolute left-4 top-4 h-6 w-6 text-zinc-500 group-hover:text-primary transition-colors duration-300' />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors duration-300'
                >
                  {showConfirmPassword ? (
                    <EyeOff className='h-6 w-6' />
                  ) : (
                    <Eye className='h-6 w-6' />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements */}
            {newPassword && (
              <div className='bg-white/5 border border-white/10 rounded-xl p-4'>
                <p className='text-sm font-medium text-zinc-300 mb-3'>Password requirements:</p>
                <ul className='space-y-2 text-sm'>
                  <li className={`flex items-center gap-2 ${passwordRequirements.minLength ? 'text-green-400' : 'text-zinc-500'}`}>
                    <CheckCircle2 className='h-4 w-4' />
                    At least 8 characters
                  </li>
                  <li className={`flex items-center gap-2 ${passwordRequirements.hasUpperCase ? 'text-green-400' : 'text-zinc-500'}`}>
                    <CheckCircle2 className='h-4 w-4' />
                    One uppercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${passwordRequirements.hasLowerCase ? 'text-green-400' : 'text-zinc-500'}`}>
                    <CheckCircle2 className='h-4 w-4' />
                    One lowercase letter
                  </li>
                  <li className={`flex items-center gap-2 ${passwordRequirements.hasNumber ? 'text-green-400' : 'text-zinc-500'}`}>
                    <CheckCircle2 className='h-4 w-4' />
                    One number
                  </li>
                  <li className={`flex items-center gap-2 ${passwordRequirements.hasSpecial ? 'text-green-400' : 'text-zinc-500'}`}>
                    <CheckCircle2 className='h-4 w-4' />
                    One special character
                  </li>
                  {confirmPassword && (
                    <li className={`flex items-center gap-2 ${passwordsMatch ? 'text-green-400' : 'text-red-400'}`}>
                      <CheckCircle2 className='h-4 w-4' />
                      Passwords match
                    </li>
                  )}
                </ul>
              </div>
            )}

            <Button 
              type='submit' 
              className='w-full h-14 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-xl bg-primary hover:bg-primary/90' 
              disabled={isLoading || !isPasswordValid || !passwordsMatch}
            >
              {isLoading && <Loader2 className='mr-2 h-5 w-5 animate-spin' />}
              Reset Password
            </Button>
          </form>

          <div className='text-center'>
            <button
              onClick={() => navigate('/login')}
              className='text-sm text-zinc-400 hover:text-white transition-colors underline-offset-4 hover:underline'
            >
              Back to login
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ResetPassword;
