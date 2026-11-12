import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';

type Props = {
  total: number;
  suggestions: number[];
};

const DEFAULT_LIMIT = '40';
const DEFAULT_PAGE = '1';

const CustomTablePagination: React.FC<Props> = ({ total, suggestions }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Ensure both page and limit are set together on initial mount to avoid double fetch
  useEffect(() => {
    const limitParam = searchParams.get('limit');
    const pageParam = searchParams.get('page');
    if (!limitParam || !pageParam) {
      const params = new URLSearchParams(window.location.search);
      params.set('limit', DEFAULT_LIMIT);
      params.set('page', DEFAULT_PAGE);
      navigate(`${window.location.pathname}?${params.toString()}`, {
        replace: true,
      });
    }
    // only runs once at mount
    // eslint-disable-next-line
  }, []);

  function getInitialLimit() {
    const limitParam = Number(searchParams.get('limit'));
    return limitParam > 0 ? limitParam.toString() : DEFAULT_LIMIT;
  }
  function getInitialPage() {
    const pageParam = Number(searchParams.get('page'));
    return pageParam > 0 ? pageParam : Number(DEFAULT_PAGE);
  }

  const [value, setValue] = useState(getInitialLimit());
  const [filtered, setFiltered] = useState(suggestions);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [page, setPage] = useState(getInitialPage());

  const inputRef = useRef<HTMLInputElement>(null);
  const debounce = useRef<any>(null);

  // Filter suggestions on input change
  useEffect(() => {
    const num = Number(value);
    setFiltered(
      suggestions.filter((opt) => opt.toString().includes(value) || opt === num)
    );
  }, [value, suggestions]);

  // Track previous limit for change detection
  const prevLimitRef = useRef(getInitialLimit());
  const didMountRef = useRef(false);

  // Handle page and limit changes in one effect, skipping first mount
  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (debounce.current) clearTimeout(debounce.current);

    debounce.current = setTimeout(() => {
      const currentLimit = value;
      const prevLimit = prevLimitRef.current;
      let nextPage = page;
      // If limit changed, reset page to 1
      if (currentLimit !== prevLimit) {
        nextPage = 1;
        setPage(1); // local state update
      }
      prevLimitRef.current = currentLimit;
      updateSearchParams(nextPage, Number(currentLimit));
    }, 300);

    return () => debounce.current && clearTimeout(debounce.current);
    // eslint-disable-next-line
  }, [value, page]);

  // Sync state to URL changes (e.g. browser navigation)
  useEffect(() => {
    setValue(getInitialLimit());
    setPage(getInitialPage());
  }, [searchParams]);

  // Pagination logic
  const perPage = Number(value) || 1;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const from = (page - 1) * perPage + 1;
  const to = Math.min(total, page * perPage);

  function updateSearchParams(nextPage: number, nextLimit: number) {
    const params = new URLSearchParams(window.location.search);
    params.set('limit', String(nextLimit));
    params.set('page', String(nextPage));
    navigate(`${window.location.pathname}?${params.toString()}`, {
      replace: true,
    });
  }

  // Suggestion click
  const handleSelect = (opt: number) => {
    setValue(opt.toString());
    setPage(1);
    updateSearchParams(1, opt);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => setShowSuggestions(true);
  const handleBlur = () => {
    setTimeout(() => setShowSuggestions(false), 120);
    if (value === '') setValue(DEFAULT_LIMIT);
  };

  const onNext = () => {
    const newPage = Math.min(totalPages, page + 1);
    setPage(newPage);
  };
  const onPrev = () => {
    const newPage = Math.max(1, page - 1);
    setPage(newPage);
  };

  return (
    <div className='flex items-center justify-end space-x-6 bg-card py-3 px-4 rounded-md'>
      <div className='relative'>
        {showSuggestions && filtered.length > 0 && (
          <ul className='absolute left-0 bottom-full mb-1 z-10 bg-popover border border-border w-full rounded shadow-lg max-h-36 overflow-auto'>
            {filtered.map((opt) => (
              <li
                key={opt}
                className='px-4 py-2 cursor-pointer hover:bg-muted/80 transition-colors'
                onMouseDown={() => handleSelect(opt)}
              >
                {opt}
              </li>
            ))}
          </ul>
        )}
        <input
          ref={inputRef}
          type='text'
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={(e) => setValue(e.target.value.replace(/[^0-9]/g, ''))}
          className='w-16 h-10 border rounded bg-background px-2 font-medium focus:outline-none border-border transition text-foreground'
          placeholder='Rows'
          autoComplete='off'
        />
      </div>
      <span className='text-muted-foreground text-sm'>
        {from}-{to} of {total}
      </span>
      <button
        className='mx-1 px-2 py-2 rounded disabled:opacity-40 bg-transparent text-foreground hover:bg-muted transition'
        onClick={onPrev}
        disabled={page <= 1}
        aria-label='Previous'
        type='button'
      >
        <ChevronLeft />
      </button>
      <button
        className='mx-1 px-2 py-2 rounded disabled:opacity-40 bg-transparent text-foreground hover:bg-muted transition'
        onClick={onNext}
        disabled={page >= totalPages}
        aria-label='Next'
        type='button'
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default CustomTablePagination;
