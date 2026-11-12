import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from './card';

interface PasswordRequirement {
  label: string;
  met: boolean;
}

interface PasswordStrengthIndicatorProps {
  password: string;
  className?: string;
}

export function PasswordStrengthIndicator({ password, className = '' }: PasswordStrengthIndicatorProps) {
  const requirements: PasswordRequirement[] = [
    {
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      label: 'Contains an uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
    },
    {
      label: 'Contains a lowercase letter (a-z)',
      met: /[a-z]/.test(password),
    },
    {
      label: 'Contains a digit (0-9)',
      met: /\d/.test(password),
    },
  ];

  const allRequirementsMet = requirements.every(req => req.met);
  const metCount = requirements.filter(req => req.met).length;

  const getStrengthColor = () => {
    if (metCount === 0) return 'bg-muted';
    if (metCount <= 2) return 'bg-destructive';
    if (metCount === 3) return 'bg-primary/60';
    return 'bg-primary';
  };

  const getStrengthText = () => {
    if (metCount === 0) return '';
    if (metCount <= 2) return 'Weak';
    if (metCount === 3) return 'Medium';
    return 'Strong';
  };

  const getStrengthTextColor = () => {
    if (metCount <= 2) return 'text-destructive';
    if (metCount === 3) return 'text-primary/70';
    return 'text-primary';
  };

  return (
    <Card className={cn('p-4', className)}>
      {/* Strength Bar */}
      {password.length > 0 && (
        <div className='mb-4'>
          <div className='flex items-center justify-between mb-2'>
            <span className='text-sm font-medium text-foreground'>
              Password Strength
            </span>
            <span className={cn('text-sm font-semibold', getStrengthTextColor())}>
              {getStrengthText()}
            </span>
          </div>
          <div className='w-full h-2 bg-muted rounded-full overflow-hidden'>
            <div
              className={cn('h-full transition-all duration-300', getStrengthColor())}
              style={{ width: `${(metCount / requirements.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Requirements List */}
      <div className='space-y-2.5'>
        <p className='text-sm font-medium text-muted-foreground'>
          Password must contain:
        </p>
        {requirements.map((requirement, index) => (
          <div
            key={index}
            className='flex items-center gap-2.5 text-sm'
          >
            <div className={cn(
              'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200',
              requirement.met
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground'
            )}>
              {requirement.met ? (
                <Check className='w-3 h-3 stroke-[3]' />
              ) : (
                <X className='w-3 h-3' />
              )}
            </div>
            <span className={cn(
              'transition-colors',
              requirement.met
                ? 'text-foreground font-medium'
                : 'text-muted-foreground'
            )}>
              {requirement.label}
            </span>
          </div>
        ))}
      </div>

      {/* Success Message */}
      {allRequirementsMet && password.length > 0 && (
        <div className='mt-4 p-3 bg-primary/5 border border-primary/20 rounded-lg'>
          <div className='flex items-center gap-2'>
            <div className='flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center'>
              <Check className='w-3 h-3 text-primary-foreground stroke-[3]' />
            </div>
            <p className='text-sm text-primary font-medium'>
              Password meets all requirements
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
