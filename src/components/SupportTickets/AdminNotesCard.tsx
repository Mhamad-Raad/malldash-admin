import { useTranslation } from 'react-i18next';
import { MessageSquare } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface AdminNotesCardProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const AdminNotesCard = ({ value, onChange, disabled }: AdminNotesCardProps) => {
  const { t } = useTranslation('supportTickets');

  return (
    <Card className='shadow-sm'>
      <CardHeader className='pb-3'>
        <CardTitle className='flex items-center gap-2 text-base'>
          <MessageSquare className='h-4 w-4 text-muted-foreground' />
          {t('detail.fields.adminNotes')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t('detail.fields.adminNotesPlaceholder')}
          className='min-h-[120px] text-sm resize-y'
          disabled={disabled}
        />
      </CardContent>
    </Card>
  );
};

export default AdminNotesCard;
