import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Users, Store, Package, Building2, FileText, Settings } from 'lucide-react';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import ThemeButton from '../ui/ThemeButton';
import LocaleToggle from '../locale-button';
import NotificationPopover from './NotificationPopover';

export default function Navbar() {
  const location = useLocation();
  const { t } = useTranslation('navbar');
  
  // Get data from Redux store
  const { user } = useSelector((state: RootState) => state.user);
  const { vendor } = useSelector((state: RootState) => state.vendor);
  const { building } = useSelector((state: RootState) => state.building);

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const getSegmentIcon = (segment: string) => {
    const iconClass = 'h-4 w-4';
    switch (segment) {
      case 'users': return <Users className={iconClass} />;
      case 'vendors': return <Store className={iconClass} />;
      case 'products': return <Package className={iconClass} />;
      case 'buildings': return <Building2 className={iconClass} />;
      case 'reports': return <FileText className={iconClass} />;
      case 'settings': return <Settings className={iconClass} />;
      default: return null;
    }
  };

  const getDisplayName = (segment: string, parentSegment?: string): { label: string; shouldShow: boolean } => {
    // Check if this is an ID (MongoDB ObjectId format or UUID)
    const isId = /^[a-f\d]{24}$/i.test(segment) || /^[a-f\d-]{36}$/i.test(segment) || /^\d+$/.test(segment);
    
    if (!isId) {
      return { label: getTranslatedSegment(segment), shouldShow: true };
    }

    // If it's an ID, try to get the actual name from the store
    if (parentSegment === 'users') {
      if (user?._id === segment) {
        return { label: `${user.firstName} ${user.lastName}`, shouldShow: true };
      }
      // Don't show anything until user data is loaded
      return { label: '', shouldShow: false };
    }
    
    if (parentSegment === 'vendors') {
      if (vendor?._id === segment) {
        return { label: vendor.businessName || segment, shouldShow: true };
      }
      return { label: '', shouldShow: false };
    }
    
    if (parentSegment === 'buildings') {
      if (building?.id.toString() === segment) {
        return { label: building.name || segment, shouldShow: true };
      }
      return { label: '', shouldShow: false };
    }

    // For unknown IDs, don't show them
    return { label: segment, shouldShow: false };
  };

  const getTranslatedSegment = (segment: string) => {
    if (segment === 'users') return t('users');
    if (segment === 'create') return t('create');
    if (segment === 'vendors') return t('vendors');
    if (segment === 'products') return t('products');
    if (segment === 'buildings') return t('buildings');
    if (segment === 'reports') return t('reports');
    if (segment === 'settings') return t('settings');
    return capitalize(segment.replace(/-/g, ' '));
  };

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    if (path === '/') return [];
    
    const segments = path.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const url = '/' + segments.slice(0, index + 1).join('/');
      const parentSegment = index > 0 ? segments[index - 1] : undefined;
      const { label, shouldShow } = getDisplayName(segment, parentSegment);
      
      return {
        label,
        shouldShow,
        url,
        isLast: index === segments.length - 1,
        segment,
        icon: getSegmentIcon(segment),
      };
    }).filter(item => item.shouldShow); // Only show items that have loaded data
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <nav className='sticky top-0 z-50 flex items-center justify-between gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2.5 shadow-sm'>
      {/* Left Section - Breadcrumb */}
      <div className='flex items-center gap-3 flex-1 min-w-0'>
        <SidebarTrigger className='hover:bg-accent transition-colors' />
        <div className='hidden sm:block h-5 w-px bg-border' />
        {breadcrumbItems.length === 0 ? (
          <div className='flex items-center gap-1.5 text-sm font-medium'>
            <Home className='h-4 w-4' />
            <span>{t('home')}</span>
          </div>
        ) : (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item) => (
                <Fragment key={item.url}>
                  {item.url !== breadcrumbItems[0].url && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {item.isLast ? (
                      <BreadcrumbPage className='flex items-center gap-1.5'>
                        {item.icon}
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink asChild>
                        <Link to={item.url} className='flex items-center gap-1.5'>
                          {item.icon}
                          {item.label}
                        </Link>
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
      </div>

      {/* Right Section - Actions */}
      <div className='flex items-center gap-2'>
        <NotificationPopover />
        <div className='hidden sm:block h-5 w-px bg-border' />
        <LocaleToggle />
        <ThemeButton />
      </div>
    </nav>
  );
}
