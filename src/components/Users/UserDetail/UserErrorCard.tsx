import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

interface UserErrorCardProps {
  error: string;
}

const UserErrorCard: React.FC<UserErrorCardProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col gap-6 p-4 md:p-6'>
      <Button
        variant='ghost'
        className='mb-6'
        onClick={() => navigate('/users')}
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back to Users
      </Button>
      <Card className='p-12 text-center'>
        <CardTitle className='text-2xl mb-2'>Error</CardTitle>
        <CardDescription>{error}</CardDescription>
      </Card>
    </div>
  );
};

export default UserErrorCard;
