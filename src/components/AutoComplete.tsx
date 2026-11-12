import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, X, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoCompleteProps {
  fetchOptions: (query: string) => Promise<string[]>;
  onSelectOption: (value: string) => void;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
}

const AutoComplete: React.FC<AutoCompleteProps> = ({
  fetchOptions,
  onSelectOption,
  placeholder = 'Search...',
  className = '',
  debounceMs = 200,
}) => {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<any>(null);

  // Fetch options as input changes (debounced)
  useEffect(() => {
    if (!input) {
      setOptions([]);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchOptions(input)
        .then((opts) => {
          setOptions(opts);
          setLoading(false);
        })
        .catch(() => {
          setError('Failed to load');
          setOptions([]);
          setLoading(false);
        });
    }, debounceMs);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, fetchOptions, debounceMs]);

  // Keyboard navigation for options
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showOptions || options.length === 0) return;
    if (e.key === 'ArrowDown') {
      setSelectedIdx((idx) => Math.min(options.length - 1, idx + 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIdx((idx) => Math.max(0, idx - 1));
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      handleSelect(options[selectedIdx]);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowOptions(true);
    setSelectedIdx(-1);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setShowOptions(false);
      // Only keep input if it matches an available option
      if (!options.includes(input)) {
        setInput('');
        onSelectOption('');
      }
      // If matches, do nothing (selection already handled)
    }, 150); // allow click select before hiding
  };

  const handleSelect = (val: string) => {
    setInput(val);
    setShowOptions(false);
    setSelectedIdx(-1);
    onSelectOption(val); // Only fire on explicit user select/Enter
  };

  const handleClear = () => {
    setInput('');
    setOptions([]);
    setSelectedIdx(-1);
    inputRef.current?.focus();
    onSelectOption('');
  };

  return (
    <div className={cn('relative w-full', className)}>
      <Input
        ref={inputRef}
        value={input}
        placeholder={placeholder}
        onChange={handleInput}
        onFocus={() => setShowOptions(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className='pr-10 shadow-sm border-muted-foreground/20 focus-visible:border-primary/50 transition-colors h-11'
        autoComplete='off'
      />
      {input.length > 0 && !loading && (
        <button
          onClick={handleClear}
          className='absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-destructive transition-all duration-200 p-1.5 rounded-full hover:bg-destructive/10 group'
          type='button'
          aria-label='Clear input'
        >
          <X className='w-3.5 h-3.5 group-hover:rotate-90 transition-transform duration-200' />
        </button>
      )}
      {loading && (
        <div className='absolute top-1/2 right-3 -translate-y-1/2'>
          <div className='relative'>
            <Loader2 className='w-4 h-4 animate-spin text-primary' />
            <div className='absolute inset-0 w-4 h-4 rounded-full bg-primary/20 animate-ping' />
          </div>
        </div>
      )}

      {showOptions && (options.length > 0 || error) && (
        <Card className='absolute z-30 left-0 right-0 mt-2 overflow-hidden border-2 shadow-2xl rounded-xl bg-popover backdrop-blur-sm animate-in fade-in-0 slide-in-from-top-2 duration-200'>
          <div className='overflow-y-auto max-h-60 divide-y divide-border/50'>
            {error ? (
              <div className='text-sm text-destructive px-4 py-3.5 flex items-center gap-3 bg-destructive/5'>
                <div className='size-2 rounded-full bg-destructive animate-pulse' />
                <span className='font-medium'>{error}</span>
              </div>
            ) : (
              options.map((option, idx) => (
                <div
                  key={option}
                  className={cn(
                    'px-4 py-3 cursor-pointer transition-all duration-150 text-sm group relative',
                    'hover:bg-primary/5 hover:pl-5',
                    'border-l-3 border-transparent',
                    selectedIdx === idx && 'bg-primary/10 border-l-primary pl-5 font-medium shadow-sm'
                  )}
                  onMouseDown={() => handleSelect(option)}
                  onMouseOver={() => setSelectedIdx(idx)}
                >
                  <div className='flex items-center justify-between gap-3'>
                    <span className={cn(
                      'transition-colors',
                      selectedIdx === idx ? 'text-foreground' : 'text-foreground/80'
                    )}>
                      {option}
                    </span>
                    {selectedIdx === idx && (
                      <Check className='size-4 text-primary animate-in fade-in zoom-in duration-150' />
                    )}
                  </div>
                  <div className={cn(
                    'absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary rounded-r-full transition-all duration-200',
                    'group-hover:h-8'
                  )} />
                </div>
              ))
            )}
            {!loading && options.length === 0 && !error && (
              <div className='px-4 py-8 text-center'>
                <Search className='size-8 mx-auto text-muted-foreground/30 mb-2' />
                <p className='text-sm text-muted-foreground font-medium'>No results found</p>
                <p className='text-xs text-muted-foreground/60 mt-1'>Try a different search term</p>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AutoComplete;
