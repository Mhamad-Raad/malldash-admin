import { useEffect, useState } from 'react';
import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

const locales = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ku', name: 'Kurdish' },
];

const LocaleToggle = () => {
  const { i18n } = useTranslation();
  const [currentLocale, setCurrentLocale] = useState(
    () => localStorage.getItem('locale') || i18n.language
  );

  useEffect(() => {
    if (currentLocale !== i18n.language) {
      i18n.changeLanguage(currentLocale);
    }
    localStorage.setItem('locale', currentLocale);
  }, [currentLocale, i18n]);

  const handleLocaleChange = (localeCode: string) => {
    setCurrentLocale(localeCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant='ghost' 
          size='icon' 
          aria-label='Change language'
          className='hover:bg-accent/50 transition-all duration-200 rounded-lg group relative'
        >
          <Languages className='h-[1.1rem] w-[1.1rem] transition-transform group-hover:scale-110' />
          <span className='absolute -bottom-0.5 right-1.5 text-[8px] font-semibold uppercase opacity-60 group-hover:opacity-100 transition-opacity'>
            {currentLocale}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {locales.map((locale) => {
          const selected = currentLocale === locale.code;
          return (
            <DropdownMenuItem
              key={locale.code}
              onClick={() => handleLocaleChange(locale.code)}
              className={`flex items-center gap-3 px-2 py-1.5 rounded-md transition ${
                selected
                  ? 'bg-gray-100 dark:bg-white/10 font-semibold ring-2 ring-gray-300 dark:ring-white/20 text-gray-900 dark:text-white'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              <span
                className='
                  flex justify-center items-center w-8 h-8 rounded-full text-sm  font-bold
                  border-2  shadow
                '
              >
                {locale.code.toUpperCase()}
              </span>
              <span className='text-base'>{locale.name}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LocaleToggle;
