'use client';

import { Input } from '@/components/ui/input';

interface SearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Search({ searchQuery, onSearchChange }: SearchProps) {
  return (
    <Input
      placeholder="Search articles tags or topics"
      value={searchQuery}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
}
