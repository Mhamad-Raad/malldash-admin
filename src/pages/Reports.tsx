import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  Users,
  Building2,
  Store,
  ShoppingCart,
  DollarSign,
  Clock,
  Filter,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Reports = () => {
  const { t } = useTranslation('reports');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const reportCategories = [
    { id: 'all', label: t('categories.all'), icon: FileText },
    { id: 'financial', label: t('categories.financial'), icon: DollarSign },
    { id: 'operations', label: t('categories.operations'), icon: TrendingUp },
    { id: 'users', label: t('categories.usersVendors'), icon: Users },
    { id: 'buildings', label: t('categories.buildings'), icon: Building2 },
  ];

  const availableReports = [
    {
      id: 1,
      title: t('reports.monthlyRevenue.title'),
      description: t('reports.monthlyRevenue.description'),
      category: 'financial',
      icon: DollarSign,
      lastGenerated: '2 hours ago',
      frequency: t('frequency.monthly'),
      status: 'ready',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: t('reports.vendorPerformance.title'),
      description: t('reports.vendorPerformance.description'),
      category: 'operations',
      icon: Store,
      lastGenerated: '5 hours ago',
      frequency: t('frequency.weekly'),
      status: 'ready',
      size: '1.8 MB',
    },
    {
      id: 3,
      title: t('reports.buildingOccupancy.title'),
      description: t('reports.buildingOccupancy.description'),
      category: 'buildings',
      icon: Building2,
      lastGenerated: '1 day ago',
      frequency: t('frequency.weekly'),
      status: 'ready',
      size: '956 KB',
    },
    {
      id: 4,
      title: t('reports.userActivity.title'),
      description: t('reports.userActivity.description'),
      category: 'users',
      icon: Users,
      lastGenerated: '3 hours ago',
      frequency: t('frequency.daily'),
      status: 'ready',
      size: '1.2 MB',
    },
    {
      id: 5,
      title: t('reports.orderAnalytics.title'),
      description: t('reports.orderAnalytics.description'),
      category: 'financial',
      icon: ShoppingCart,
      lastGenerated: '6 hours ago',
      frequency: t('frequency.daily'),
      status: 'ready',
      size: '3.1 MB',
    },
    {
      id: 6,
      title: t('reports.maintenance.title'),
      description: t('reports.maintenance.description'),
      category: 'buildings',
      icon: TrendingUp,
      lastGenerated: '12 hours ago',
      frequency: t('frequency.weekly'),
      status: 'generating',
      size: '-',
    },
    {
      id: 7,
      title: t('reports.financialSummary.title'),
      description: t('reports.financialSummary.description'),
      category: 'financial',
      icon: DollarSign,
      lastGenerated: '1 day ago',
      frequency: t('frequency.monthly'),
      status: 'ready',
      size: '2.8 MB',
    },
    {
      id: 8,
      title: t('reports.vendorCompliance.title'),
      description: t('reports.vendorCompliance.description'),
      category: 'operations',
      icon: FileText,
      lastGenerated: '2 days ago',
      frequency: t('frequency.monthly'),
      status: 'ready',
      size: '1.5 MB',
    },
  ];

  const quickStats = [
    {
      label: t('stats.totalReports'),
      value: '48',
      trend: '+12%',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      label: t('stats.generatedToday'),
      value: '8',
      trend: '+25%',
      icon: Clock,
      color: 'text-green-600',
    },
    {
      label: t('stats.scheduled'),
      value: '12',
      trend: '—',
      icon: Calendar,
      color: 'text-purple-600',
    },
    {
      label: t('stats.totalSize'),
      value: '124 MB',
      trend: '+8%',
      icon: Download,
      color: 'text-orange-600',
    },
  ];

  const filteredReports = availableReports.filter(
    (report) => selectedCategory === 'all' || report.category === selectedCategory
  );

  const handleGenerateReport = (reportId: number) => {
    console.log(`Generating report ${reportId}`);
    // Add your report generation logic here
  };

  const handleDownloadReport = (reportId: number) => {
    console.log(`Downloading report ${reportId}`);
    // Add your download logic here
  };

  return (
    <div className='w-full h-full flex flex-col gap-6 p-6 overflow-y-auto'>
      {/* Header */}
      <div className='flex flex-col gap-2'>
        <h1 className='text-3xl font-bold tracking-tight'>{t('title')}</h1>
        <p className='text-muted-foreground'>
          {t('description')}
        </p>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
        {quickStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className='p-6'>
                <div className='flex items-center justify-between'>
                  <div className='space-y-1'>
                    <p className='text-sm text-muted-foreground'>{stat.label}</p>
                    <p className='text-2xl font-bold'>{stat.value}</p>
                    <p className='text-xs text-muted-foreground'>{t('trendFromLastMonth', { trend: stat.trend })}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className='p-6'>
          <div className='flex flex-col md:flex-row gap-4 items-start md:items-center justify-between'>
            <div className='flex flex-wrap gap-2'>
              {reportCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size='sm'
                    onClick={() => setSelectedCategory(category.id)}
                    className='gap-2'
                  >
                    <Icon className='h-4 w-4' />
                    {category.label}
                  </Button>
                );
              })}
            </div>
            <div className='flex gap-2 items-center'>
              <Filter className='h-4 w-4 text-muted-foreground' />
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder={t('filters.selectPeriod')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='today'>{t('filters.today')}</SelectItem>
                  <SelectItem value='week'>{t('filters.thisWeek')}</SelectItem>
                  <SelectItem value='month'>{t('filters.thisMonth')}</SelectItem>
                  <SelectItem value='quarter'>{t('filters.thisQuarter')}</SelectItem>
                  <SelectItem value='year'>{t('filters.thisYear')}</SelectItem>
                  <SelectItem value='custom'>{t('filters.customRange')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {filteredReports.map((report) => {
          const Icon = report.icon;
          return (
            <Card key={report.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div className='flex items-start justify-between'>
                  <div className='flex items-start gap-3'>
                    <div className='p-2 bg-primary/10 rounded-lg'>
                      <Icon className='h-5 w-5 text-primary' />
                    </div>
                    <div className='space-y-1'>
                      <CardTitle className='text-lg'>{report.title}</CardTitle>
                      <CardDescription className='text-sm'>
                        {report.description}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex flex-wrap gap-2'>
                  <Badge variant='secondary' className='gap-1'>
                    <Clock className='h-3 w-3' />
                    {report.frequency}
                  </Badge>
                  <Badge
                    variant={report.status === 'ready' ? 'default' : 'outline'}
                    className={
                      report.status === 'ready'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : ''
                    }
                  >
                    {report.status === 'ready' ? t('status.ready') : t('status.generating')}
                  </Badge>
                  {report.size !== '-' && (
                    <Badge variant='outline' className='gap-1'>
                      {report.size}
                    </Badge>
                  )}
                </div>

                <div className='flex items-center justify-between pt-2 border-t'>
                  <p className='text-xs text-muted-foreground'>
                    {t('lastGenerated', { time: report.lastGenerated })}
                  </p>
                  <div className='flex gap-2'>
                    <Button
                      size='sm'
                      variant='outline'
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={report.status === 'generating'}
                    >
                      <TrendingUp className='h-4 w-4 mr-2' />
                      {t('actions.generate')}
                    </Button>
                    {report.status === 'ready' && (
                      <Button
                        size='sm'
                        onClick={() => handleDownloadReport(report.id)}
                      >
                        <Download className='h-4 w-4 mr-2' />
                        {t('actions.download')}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Calendar className='h-5 w-5' />
            {t('scheduled.title')}
          </CardTitle>
          <CardDescription>
            {t('scheduled.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {[
              { name: t('scheduled.weeklyOperations'), schedule: t('scheduled.everyMonday'), active: true },
              { name: t('scheduled.monthlyFinancial'), schedule: t('scheduled.firstOfMonth'), active: true },
              { name: t('scheduled.dailySales'), schedule: t('scheduled.everyDay'), active: false },
            ].map((scheduled, index) => (
              <div
                key={index}
                className='flex items-center justify-between p-4 border rounded-lg'
              >
                <div className='space-y-1'>
                  <p className='font-medium'>{scheduled.name}</p>
                  <p className='text-sm text-muted-foreground'>{scheduled.schedule}</p>
                </div>
                <Badge variant={scheduled.active ? 'default' : 'secondary'}>
                  {scheduled.active ? t('status.active') : t('status.paused')}
                </Badge>
              </div>
            ))}
          </div>
          <Button className='w-full mt-4' variant='outline'>
            <Calendar className='h-4 w-4 mr-2' />
            {t('actions.manageSchedule')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
