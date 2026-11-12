import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Camera, Mail, Phone, Shield, ImageIcon, X } from 'lucide-react';
import roles from '@/constants/roles';

interface ProfileOverviewCardProps {
  user: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
    role: number;
  };
  imagePreview: string | null;
  imageFile: File | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}

const ProfileOverviewCard = ({
  user,
  imagePreview,
  imageFile,
  fileInputRef,
  onImageChange,
  onRemoveImage,
}: ProfileOverviewCardProps) => {
  const { t } = useTranslation('profile');
  
  const getRoleName = (role: number) => {
    return roles[role] || 'Unknown';
  };

  const getRoleBadgeVariant = (role: number) => {
    switch (role) {
      case 0:
        return 'default'; // SuperAdmin
      case 1:
        return 'secondary'; // Admin
      default:
        return 'outline';
    }
  };

  return (
    <Card className='lg:col-span-1 flex flex-col'>
      <CardContent className='pt-6 flex-1 flex flex-col'>
        <div className='flex flex-col items-center text-center space-y-4'>
          {/* Large Avatar with Upload */}
          <div className='relative group'>
            <Avatar className='h-32 w-32 border-4 border-background shadow-xl'>
              <AvatarImage
                src={imagePreview || undefined}
                alt='Profile'
                className='object-cover'
              />
              <AvatarFallback className='text-3xl font-semibold bg-primary/10 text-primary'>
                {user.firstName?.[0]?.toUpperCase()}
                {user.lastName?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <input
              type='file'
              ref={fileInputRef}
              className='hidden'
              accept='image/*'
              onChange={onImageChange}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className='absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all duration-200 hover:scale-105'
            >
              <Camera className='h-4 w-4' />
            </button>
          </div>

          {/* Image actions */}
          {imageFile && (
            <div className='flex items-center gap-2'>
              <Badge variant='secondary' className='gap-1'>
                <ImageIcon className='h-3 w-3' />
                {t('messages.newPhotoSelected')}
              </Badge>
              <Button
                variant='ghost'
                size='sm'
                onClick={onRemoveImage}
                className='h-6 w-6 p-0'
              >
                <X className='h-3 w-3' />
              </Button>
            </div>
          )}

          {/* User Info */}
          <div className='space-y-1'>
            <h2 className='text-xl font-semibold'>
              {user.firstName} {user.lastName}
            </h2>
            <p className='text-sm text-muted-foreground'>{user.email}</p>
          </div>

          {/* Role Badge */}
          <Badge
            variant={getRoleBadgeVariant(user.role)}
            className='px-3 py-1'
          >
            <Shield className='h-3 w-3 mr-1' />
            {getRoleName(user.role)}
          </Badge>

          <Separator className='my-4' />

          {/* Quick Stats */}
          <div className='w-full space-y-3'>
            <div className='flex items-center gap-3 text-sm'>
              <div className='p-2 rounded-lg bg-muted'>
                <Mail className='h-4 w-4 text-muted-foreground' />
              </div>
              <div className='flex-1 text-left'>
                <p className='text-muted-foreground text-xs'>{t('labels.email')}</p>
                <p className='font-medium truncate'>{user.email}</p>
              </div>
            </div>
            <div className='flex items-center gap-3 text-sm'>
              <div className='p-2 rounded-lg bg-muted'>
                <Phone className='h-4 w-4 text-muted-foreground' />
              </div>
              <div className='flex-1 text-left'>
                <p className='text-muted-foreground text-xs'>{t('labels.phone')}</p>
                <p className='font-medium'>
                  {user.phoneNumber || t('messages.notSet')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileOverviewCard;
