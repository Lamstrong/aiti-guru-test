import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { debounce } from '../../utils/debounce';

export function useSearchState() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as Record<string, unknown>;
  const urlQuery = (search.q as string) || '';

  const [searchValue, setSearchValue] = useState(urlQuery);

  useEffect(() => {
    setSearchValue(urlQuery);
  }, [urlQuery]);

  const debouncedNavigate = useMemo(
    () =>
      debounce((query: string) => {
        navigate({
          to: '/product/list',
          search: (prev: Record<string, unknown>) => ({
            ...prev,
            q: query || undefined,
            page: 1,
          }),
        });
      }, 500),
    [navigate]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedNavigate(value);
  };

  return {
    searchValue,
    handleSearchChange,
  };
}
