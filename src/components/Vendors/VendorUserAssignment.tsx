import { memo, useState, useEffect } from 'react';
import { User, Mail, Phone, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ObjectAutoComplete } from '@/components/ObjectAutoComplete';
import { fetchUsers } from '@/data/Users';
import type { UserType } from '@/interfaces/Users.interface';

interface VendorUserAssignmentProps {
  userId: string;
  userName: string;
  userEmail?: string;
  userPhone?: string;
  userRole?: number;
  userProfileImage?: string;
  onUserSelect: (userId: string, userName: string) => void;
}

const VendorUserAssignment = memo(({
  userId,
  userName,
  userEmail,
  userPhone,
  userRole,
  userProfileImage,
  onUserSelect,
}: VendorUserAssignmentProps) => {
  const { t } = useTranslation('vendors');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  // Reset selectedUser when userName is cleared (empty string)
  useEffect(() => {
    if (!userName) {
      setSelectedUser(null);
    }
  }, [userName]);

  const getRoleBadge = (role: number) => {
    switch (role) {
      case 0:
        return <Badge variant="destructive" className="text-xs"><Shield className="w-3 h-3 mr-1" />{t('userAssignment.roles.admin')}</Badge>;
      case 1:
        return <Badge variant="secondary" className="text-xs"><UserCheck className="w-3 h-3 mr-1" />{t('userAssignment.roles.manager')}</Badge>;
      case 2:
        return <Badge variant="outline" className="text-xs"><User className="w-3 h-3 mr-1" />{t('userAssignment.roles.vendor')}</Badge>;
      default:
        return <Badge variant="outline" className="text-xs">{t('userAssignment.roles.user')}</Badge>;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Card className="overflow-visible">
      <CardHeader className="border-b">
        <CardTitle className='flex items-center gap-2'>
          <UserCheck className='h-5 w-5 text-primary' />
          <div>
            <div className="text-lg font-semibold">{t('userAssignment.title')}</div>
            <div className="text-xs font-normal text-muted-foreground">{t('userAssignment.subtitle')}</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4 pt-6'>
        <div className='space-y-3 relative'>
          <Label htmlFor='userId' className="text-sm font-semibold flex items-center gap-2">
            <User className="w-4 h-4" />
            {t('userAssignment.selectManager')}
            <span className='text-destructive'>*</span>
          </Label>
          <ObjectAutoComplete
            fetchOptions={async (query) => {
              const res = await fetchUsers({
                searchTerm: query,
                limit: 10,
                role: 2,
              });
              if (res.error || !res.data) return [];
              return res.data;
            }}
            onSelectOption={(user: UserType | null) => {
              if (user) {
                setSelectedUser(user);
                onUserSelect(
                  user._id,
                  `${user.firstName} ${user.lastName}`
                );
              } else {
                setSelectedUser(null);
                onUserSelect('', '');
              }
            }}
            getOptionLabel={(user: UserType) =>
              `${user.firstName} ${user.lastName} (${user.email})`
            }
            placeholder={t('userAssignment.searchPlaceholder')}
            initialValue={userName}
          />
          
          {/* User Display Card or Empty State */}
          {userName ? (
            <div className='mt-4 p-4 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-950/20 dark:to-blue-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-lg shadow-sm space-y-4'>
              {/* User Header with Avatar */}
              <div className='flex items-start gap-4'>
                <Avatar className='h-16 w-16 border-2 border-white dark:border-gray-800 shadow-md'>
                  <AvatarImage src={selectedUser ? selectedUser.profileImageUrl : userProfileImage} alt={userName} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-bold text-lg">
                    {selectedUser ? getInitials(selectedUser.firstName, selectedUser.lastName) : userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                
                <div className='flex-1 space-y-2'>
                  <div className='flex items-start justify-between'>
                    <div>
                      <h4 className='font-bold text-lg text-gray-900 dark:text-gray-100 flex items-center gap-2'>
                        {userName}
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      </h4>
                      <p className='text-xs text-gray-600 dark:text-gray-400 font-medium'>
                        ID: {userId}
                      </p>
                    </div>
                    {(selectedUser || userRole !== undefined) && getRoleBadge(selectedUser?.role ?? userRole ?? 2)}
                  </div>
                  
                  {/* Contact Info Grid */}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2 mt-3'>
                    {(selectedUser?.email || userEmail) && (
                      <div className='flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-md border border-gray-200 dark:border-gray-700'>
                        <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className='text-xs text-gray-500 dark:text-gray-400'>{t('userAssignment.email')}</p>
                          <p className='text-xs font-medium text-gray-900 dark:text-gray-100 truncate'>
                            {selectedUser?.email || userEmail}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {(selectedUser?.phoneNumber || userPhone) && (
                      <div className='flex items-center gap-2 p-2 bg-white/60 dark:bg-gray-800/60 rounded-md border border-gray-200 dark:border-gray-700'>
                        <Phone className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className='text-xs text-gray-500 dark:text-gray-400'>{t('userAssignment.phone')}</p>
                          <p className='text-xs font-medium text-gray-900 dark:text-gray-100 truncate'>
                            {selectedUser?.phoneNumber || userPhone}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className='flex gap-2 pt-2 border-t border-emerald-200 dark:border-emerald-800'>
                {(selectedUser?.email || userEmail) && (
                  <a
                    href={`mailto:${selectedUser?.email || userEmail}`}
                    className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-md hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors'
                  >
                    <Mail className="w-3 h-3" />
                    {t('userAssignment.sendEmail')}
                  </a>
                )}
                {(selectedUser?.phoneNumber || userPhone) && (
                  <a
                    href={`tel:${selectedUser?.phoneNumber || userPhone}`}
                    className='flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 rounded-md hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors'
                  >
                    <Phone className="w-3 h-3" />
                    {t('userAssignment.call')}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className='mt-4 p-6 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg'>
              <div className='flex flex-col items-center justify-center text-center space-y-3'>
                <div className='p-3 bg-gray-200 dark:bg-gray-800 rounded-full'>
                  <UserCheck className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                <div>
                  <h4 className='font-semibold text-gray-700 dark:text-gray-300'>{t('userAssignment.noUserAssigned')}</h4>
                  <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                    {t('userAssignment.searchPlaceholder')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

VendorUserAssignment.displayName = 'VendorUserAssignment';

export default VendorUserAssignment;
