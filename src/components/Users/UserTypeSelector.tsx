import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';

const userTypeSections = [
  {
    title: 'Staff Account',
    description: 'Admin or Vendor with system access',
    value: 'Staff',
    icon: '👔',
  },
  {
    title: 'Customer Account',
    description: 'Tenant with standard access',
    value: 'Customer',
    icon: '👤',
  },
];

interface UserTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function UserTypeSelector({ selectedType, onTypeChange }: UserTypeSelectorProps) {
  const { t } = useTranslation('users');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg'>{t('createUser.userType.title')}</CardTitle>
        <CardDescription>{t('createUser.userType.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {userTypeSections.map((section) => (
            <button
              key={section.value}
              onClick={() => onTypeChange(section.value)}
              className={`p-6 rounded-lg border-2 transition-all text-left hover:shadow-md ${
                selectedType === section.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className='flex flex-col items-center text-center gap-3'>
                <span className='text-5xl'>{section.icon}</span>
                <div className='space-y-1'>
                  <p className='font-semibold text-lg'>
                    {section.value === 'Staff' 
                      ? t('createUser.userType.staff.title') 
                      : t('createUser.userType.customer.title')}
                  </p>
                  <p className='text-xs text-muted-foreground'>
                    {section.value === 'Staff' 
                      ? t('createUser.userType.staff.description') 
                      : t('createUser.userType.customer.description')}
                  </p>
                </div>
                {selectedType === section.value && (
                  <Badge variant='default'>
                    Selected
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
