// Dashboard Statistics
export interface DashboardStat {
  id: string;
  title: string;
  value: number;
  previousValue?: number;
  icon: 'users' | 'vendors' | 'buildings' | 'products' | 'requests' | 'apartments';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description: string;
  href?: string;
}

export interface DashboardStatsProps {
  stats: DashboardStat[];
  isLoading?: boolean;
}

// Legacy HomeCard interface (kept for backward compatibility)
export interface HomeCard {
  title: string;
  value: number;
  badge: { text: string; trendingUp: boolean | null };
  footer: string;
}

export interface HomeCardsProps {
  cards: HomeCard[];
}

// Activity Feed
export interface ActivityItem {
  id: string;
  type: 'user_created' | 'vendor_created' | 'building_added' | 'product_added' | 'request_submitted';
  title: string;
  description: string;
  timestamp: string;
  actor?: {
    name: string;
    avatar?: string;
  };
  metadata?: Record<string, string | number>;
}

export interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading?: boolean;
  maxItems?: number;
}

// Building Occupancy
export interface BuildingOccupancy {
  id: number;
  name: string;
  totalApartments: number;
  occupied: number;
  occupancyRate: number;
}

export interface OccupancyOverview {
  totalBuildings: number;
  totalApartments: number;
  totalOccupied: number;
  totalVacant: number;
  overallRate: number;
  buildings: BuildingOccupancy[];
}

export interface OccupancyChartProps {
  data: OccupancyOverview;
  isLoading?: boolean;
}

// Vendor Distribution
export interface VendorTypeDistribution {
  type: string;
  count: number;
  percentage: number;
}

export interface VendorDistributionProps {
  data: VendorTypeDistribution[];
  totalVendors: number;
  isLoading?: boolean;
}

// Quick Actions
export interface QuickAction {
  id: string;
  label: string;
  icon: 'plus' | 'user' | 'building' | 'store' | 'box' | 'settings';
  href: string;
  variant?: 'default' | 'outline' | 'secondary';
}

export interface QuickActionsProps {
  actions: QuickAction[];
}

// Top Vendors
export interface TopVendor {
  id: number;
  name: string;
  type: string;
  orderCount: number;
  logo?: string;
}

export interface TopVendorsProps {
  vendors: TopVendor[];
  isLoading?: boolean;
}

// Recent Orders (kept for legacy support)
export interface RecentOrderItems {
  id: string;
  name: string;
  src: string;
  fallback: string;
  vendor: string;
  location: string;
  status: string;
}

export interface RecentOrdersHomeProps {
  items: RecentOrderItems[];
}

// Top Selling (kept for legacy support)
export interface TopSellingItems {
  id: string;
  type: string;
  vendor: string;
  sold: number;
}

export interface TopSellingItemsHomeProps {
  items: TopSellingItems[];
}

// System Health
export interface SystemHealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value?: string;
  lastUpdated: string;
}

export interface SystemHealthProps {
  metrics: SystemHealthMetric[];
  isLoading?: boolean;
}
