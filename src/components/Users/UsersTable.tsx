import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Mail, Phone, Building2, User as UserIcon, ChevronRight } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import UsersTableSkeleton from './UsersTableSkeleton';
import CustomTablePagination from '../CustomTablePagination';

import roles from '@/constants/roles';

import type { RootState } from '@/store/store';

const getUserTypeColor = (type: string) => {
  const typeLower = type.toLowerCase();
  if (typeLower === 'superadmin')
    return 'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400 border-red-500/30 dark:border-red-500/40';
  if (typeLower === 'admin')
    return 'bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/30 dark:border-purple-500/40';
  if (typeLower === 'vendor')
    return 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/30 dark:border-blue-500/40';
  if (typeLower === 'tenant')
    return 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/40';
  return 'bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400 border-gray-500/30 dark:border-gray-500/40';
};

const UsersTable = () => {
  const { t } = useTranslation('users');
  const navigate = useNavigate();

  const {
    users,
    lusers: loading,
    eusers: error,
    total,
  } = useSelector((state: RootState) => state.users);

  const handleRowClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  if (error) {
    return (
      <div className='rounded-lg border bg-card shadow-sm p-8'>
        <div className='text-center text-destructive'>{t('error')}: {error}</div>
      </div>
    );
  }

  return (
    <div className='rounded-xl border bg-card shadow-sm flex flex-col overflow-hidden'>
      {/* Scrollable table area - responsive height based on viewport */}
      <ScrollArea className='h-[calc(100vh-280px)] md:h-[calc(100vh-280px)]'>
        <Table className='w-full min-w-[700px]'>
          <TableHeader>
            <TableRow className='hover:bg-transparent border-b bg-muted/50'>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('tableHeaders.user')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('tableHeaders.contact')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('tableHeaders.role')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 font-semibold text-foreground/80 bg-muted/50 backdrop-blur-sm border-b h-12'>
                {t('tableHeaders.location')}
              </TableHead>
              <TableHead className='sticky top-0 z-10 w-12 bg-muted/50 backdrop-blur-sm border-b h-12'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <UsersTableSkeleton key={`skeleton-${index}`} />
                ))
              : users.map((user, index) => {
                  const fullName = `${user.firstName} ${user.lastName}`;
                  const userRole = roles[user.role];
                  // Translate role based on the role name
                  const translatedRole = userRole === 'SuperAdmin' ? t('roles.superAdmin')
                    : userRole === 'Admin' ? t('roles.admin')
                    : userRole === 'Vendor' ? t('roles.vendor')
                    : userRole === 'Tenant' ? t('roles.tenant')
                    : userRole;
                  // Generate initials for fallback
                  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
                  // Use profileImageUrl or src (backward compatibility)
                  const avatarSrc = user.profileImageUrl || user.src;

                  return (
                    <TableRow
                      key={`${user?._id}-${index}`}
                      className='group hover:bg-muted/50 transition-all cursor-pointer border-b last:border-0'
                      onClick={() => handleRowClick(user?._id)}
                    >
                      {/* User Info with Avatar */}
                      <TableCell className='font-medium py-4'>
                        <div className='flex items-center gap-3'>
                          <Avatar className='h-14 w-14 border-2 border-border shadow-sm transition-all group-hover:shadow-md group-hover:border-primary/50'>
                            <AvatarImage
                              src={avatarSrc}
                              alt={fullName}
                              onError={(e) => {
                                // Hide broken images gracefully
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            <AvatarFallback className='text-sm font-semibold bg-gradient-to-br from-primary/20 to-primary/10 text-primary'>
                              {initials || user.fallback || (
                                <UserIcon className='h-5 w-5' />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className='flex flex-col gap-0.5'>
                            <span className='font-semibold text-lg leading-tight group-hover:text-primary transition-colors'>
                              {fullName}
                            </span>
                            <span className='text-sm text-muted-foreground font-mono leading-tight'>
                              {user?._id.slice(-8)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      {/* Contact Information */}
                      <TableCell className='py-4'>
                        <div className='flex flex-col gap-2 min-w-[200px]'>
                          <div className='flex items-center gap-2.5'>
                            <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors'>
                              <Mail className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                            </div>
                            <span className='text-base text-foreground/80'>{user.email}</span>
                          </div>
                          <div className='flex items-center gap-2.5'>
                            <div className='flex items-center justify-center w-6 h-6 rounded-md bg-muted group-hover:bg-primary/10 transition-colors'>
                              <Phone className='h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors' />
                            </div>
                            <span className='text-base font-medium text-foreground/80'>
                              {user.phoneNumber}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      {/* User Type/Role */}
                      <TableCell className='py-4'>
                        <Badge
                          variant='outline'
                          className={`${getUserTypeColor(userRole)} font-semibold text-base px-3 py-1`}
                        >
                          {translatedRole}
                        </Badge>
                      </TableCell>
                      {/* Building/Location */}
                      <TableCell className='py-4'>
                        <div className='flex items-center gap-2.5 min-w-[150px]'>
                          <div className='flex items-center justify-center w-7 h-7 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors'>
                            <Building2 className='h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors' />
                          </div>
                          <span className='text-base font-medium text-foreground/90'>
                            {user.buildingName || 'N/A'}
                          </span>
                        </div>
                      </TableCell>
                      {/* Chevron indicator */}
                      <TableCell className='py-4 w-12'>
                        <ChevronRight className='h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all' />
                      </TableCell>
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>

      {/* Pagination */}
      <div className='border-t px-4 py-3 bg-muted/20'>
        <CustomTablePagination
          total={total}
          suggestions={[10, 20, 40, 50, 100]}
        />
      </div>
    </div>
  );
};

export default UsersTable;
