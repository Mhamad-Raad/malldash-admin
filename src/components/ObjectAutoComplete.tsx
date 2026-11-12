import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ObjectAutoCompleteProps<T> {
  fetchOptions: (query: string) => Promise<T[]>;
  onSelectOption: (option: T) => void;
  getOptionLabel: (option: T) => string;
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  initialValue?: string;
}

export function ObjectAutoComplete<T>({
  fetchOptions,
  onSelectOption,
  getOptionLabel,
  placeholder = 'Search...',
  className = '',
  debounceMs = 200,
  initialValue = '',
}: ObjectAutoCompleteProps<T>) {
  const [input, setInput] = useState(initialValue);
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<any>(null);

  // Update input when initialValue changes (including when cleared)
  useEffect(() => {
    setInput(initialValue || '');
  }, [initialValue]);

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
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showOptions || options.length === 0) return;
    if (e.key === 'ArrowDown') {
      setSelectedIdx((idx) => Math.min(options.length - 1, idx + 1));
    } else if (e.key === 'ArrowUp') {
      setSelectedIdx((idx) => Math.max(0, idx - 1));
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      handleSelect(options[selectedIdx]);
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    setShowOptions(true);
    setSelectedIdx(-1);
  }

  function handleBlur() {
    setTimeout(() => {
      setShowOptions(false);
      // If input matches a label, leave it; otherwise, clear
      if (
        options.length &&
        !options.some((opt) => getOptionLabel(opt) === input)
      ) {
        setInput('');
      }
    }, 150);
  }

  function handleSelect(option: T) {
    setInput(getOptionLabel(option));
    setShowOptions(false);
    setSelectedIdx(-1);
    onSelectOption(option);
  }

  function handleClear() {
    setInput('');
    setOptions([]);
    setSelectedIdx(-1);
    inputRef.current?.focus();
    onSelectOption(undefined as unknown as T); // Call onSelectOption with undefined to notify parent
  }

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
        className='pr-10 h-10 bg-background/80 border-border/50 focus-visible:border-primary/50 focus-visible:ring-primary/20 focus-visible:shadow-sm transition-all rounded-xl'
        autoComplete='off'
      />
      {input.length > 0 && (
        <button
          onClick={handleClear}
          className='absolute top-1/2 right-10 -translate-y-1/2 text-muted-foreground hover:text-primary'
          type='button'
        >
          <X className='w-4 h-4' />
        </button>
      )}
      {loading && (
        <span className='absolute top-1/2 right-4 -translate-y-1/2 animate-spin text-primary'>
          <Loader2 className='w-4 h-4' />
        </span>
      )}

      {showOptions && (options.length > 0 || error) && (
        <Card className='absolute z-[100] left-0 right-0 mt-1 max-h-60 overflow-auto border shadow-lg'>
          {error ? (
            <div className='text-sm text-destructive p-2'>{error}</div>
          ) : (
            options.map((option, idx) => (
              <div
                key={idx}
                className={cn(
                  'px-4 py-2 cursor-pointer hover:bg-muted',
                  selectedIdx === idx && 'bg-primary/10 font-semibold'
                )}
                onMouseDown={() => handleSelect(option)}
                onMouseOver={() => setSelectedIdx(idx)}
              >
                {getOptionLabel(option)}
              </div>
            ))
          )}
          {!loading && options.length === 0 && !error && (
            <div className='text-sm text-muted-foreground p-2'>No results</div>
          )}
        </Card>
      )}
    </div>
  );
}
