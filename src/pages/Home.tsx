import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { RefreshCw, Calendar } from 'lucide-react';

// Components
import DashboardStats from '@/components/Home/DashboardStats';
import OccupancyChart from '@/components/Home/OccupancyChart';
import VendorDistribution from '@/components/Home/VendorDistribution';
import TopVendors from '@/components/Home/TopVendors';
import { Button } from '@/components/ui/button';

// Data fetching
import { fetchDashboardStats } from '@/data/Dashboard';
import { fetchBuildings } from '@/data/Buildings';
import { fetchVendors } from '@/data/Vendor';

// Types
import type {
  DashboardStat,
  OccupancyOverview,
  BuildingOccupancy,
  VendorTypeDistribution,
  TopVendor,
} from '@/interfaces/Home.interface';
import type { BuildingListItem } from '@/interfaces/Building.interface';
import type { VendorAPIResponse } from '@/interfaces/Vendor.interface';

const Home = () => {
  const { t } = useTranslation('home');

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data states
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    activeVendors: 0,
    totalBuildings: 0,
    totalApartments: 0,
    occupiedApartments: 0,
    totalProducts: 0,
    pendingRequests: 0,
  });
  const [vendorsData, setVendorsData] = useState<VendorAPIResponse[]>([]);
  const [buildingsData, setBuildingsData] = useState<BuildingListItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fetch all dashboard data
  const fetchDashboardData = async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      // Fetch all data in parallel
      const [statsResponse, vendorsResponse, buildingsResponse] = await Promise.all([
        fetchDashboardStats(),
        fetchVendors({ limit: 100 }),
        fetchBuildings({ limit: 100 }),
      ]);

      // Process dashboard stats
      if (statsResponse && !statsResponse.error) {
        setDashboardData(statsResponse);
      }

      // Process vendors
      if (vendorsResponse && !vendorsResponse.error) {
        setVendorsData(vendorsResponse.data || []);
      }

      // Process buildings
      if (buildingsResponse && !buildingsResponse.error) {
        setBuildingsData(buildingsResponse.data || []);
      }

      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Compute dashboard stats
  const dashboardStats: DashboardStat[] = useMemo(() => {
    return [
      {
        id: 'users',
        title: t('cards.users'),
        value: dashboardData.totalUsers,
        icon: 'users',
        description: t('cards.applicationWide'),
        href: '/users',
      },
      {
        id: 'vendors',
        title: t('cards.vendors'),
        value: dashboardData.activeVendors,
        icon: 'vendors',
        description: t('cards.activeVendors', 'Active vendors in the system'),
        href: '/vendors',
      },
      {
        id: 'buildings',
        title: t('cards.buildings', 'Buildings'),
        value: dashboardData.totalBuildings,
        icon: 'buildings',
        description: t('cards.managedBuildings', 'Managed buildings'),
        href: '/buildings',
      },
      {
        id: 'apartments',
        title: t('cards.apartments', 'Apartments'),
        value: dashboardData.totalApartments,
        icon: 'apartments',
        description: `${dashboardData.occupiedApartments} ${t('occupancy.occupied').toLowerCase()}`,
        href: '/buildings',
      },
      {
        id: 'products',
        title: t('cards.products', 'Products'),
        value: dashboardData.totalProducts,
        icon: 'products',
        description: t('cards.listedProducts', 'Listed products'),
        href: '/products',
      },
      {
        id: 'requests',
        title: t('cards.requests'),
        value: dashboardData.pendingRequests,
        icon: 'requests',
        description: t('cards.customerRequests'),
        href: '/requests',
      },
    ];
  }, [dashboardData, t]);

  // Compute occupancy data
  const occupancyData: OccupancyOverview = useMemo(() => {
    const buildings: BuildingOccupancy[] = buildingsData.map((b) => ({
      id: b.id,
      name: b.name,
      totalApartments: b.totalApartments || 0,
      occupied: b.occupants || 0,
      occupancyRate: b.totalApartments > 0 ? ((b.occupants || 0) / b.totalApartments) * 100 : 0,
    }));

    return {
      totalBuildings: dashboardData.totalBuildings,
      totalApartments: dashboardData.totalApartments,
      totalOccupied: dashboardData.occupiedApartments,
      totalVacant: dashboardData.totalApartments - dashboardData.occupiedApartments,
      overallRate: dashboardData.totalApartments > 0 ? (dashboardData.occupiedApartments / dashboardData.totalApartments) * 100 : 0,
      buildings: buildings.sort((a, b) => b.occupancyRate - a.occupancyRate),
    };
  }, [buildingsData, dashboardData]);

  // Compute vendor distribution
  const vendorDistribution: VendorTypeDistribution[] = useMemo(() => {
    const typeCount: Record<string, number> = {};

    vendorsData.forEach((vendor) => {
      const type = vendor.type || 'Other';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const total = vendorsData.length;
    return Object.entries(typeCount)
      .map(([type, count]) => ({
        type,
        count,
        percentage: total > 0 ? (count / total) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }, [vendorsData]);

  // Compute top vendors
  const topVendors: TopVendor[] = useMemo(() => {
    // TODO: Replace with actual order count from orders API when available
    return vendorsData.slice(0, 5).map((v) => ({
      id: v.id,
      name: v.name,
      type: v.type || 'Other',
      orderCount: 0, // Placeholder - would come from orders API
      logo: v.profileImageUrl || undefined,
    }));
  }, [vendorsData]);

  const formatLastUpdated = () => {
    return lastUpdated.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold tracking-tight'>
            {t('title', 'Dashboard')}
          </h1>
          <p className='text-muted-foreground text-sm'>
            {t('subtitle', 'Welcome back! Here\'s an overview of your system.')}
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <Calendar className='size-3.5' />
            <span>{t('lastUpdated', 'Last updated')}: {formatLastUpdated()}</span>
          </div>
          <Button
            variant='outline'
            size='sm'
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className='h-8'
          >
            <RefreshCw className={`size-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('actions.refresh', 'Refresh')}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={dashboardStats} isLoading={isLoading} />

      {/* Building Occupancy - Full Width */}
      <OccupancyChart data={occupancyData} isLoading={isLoading} />

      {/* Vendors Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <VendorDistribution
          data={vendorDistribution}
          totalVendors={vendorsData.length}
          isLoading={isLoading}
        />
        <TopVendors vendors={topVendors} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Home;
