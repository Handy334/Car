
"use client";

import React, { useState, useEffect } from 'react';
import type { Filters, SortOption } from '@/types';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox'; // Import Combobox
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Filter, RotateCcw } from 'lucide-react';

interface CarFiltersProps {
  onFilterChange: (filters: Filters, sortOption: SortOption) => void;
  initialFilters?: Partial<Filters>;
  initialSortOption?: SortOption;
  availableMakes: string[]; 
}

const defaultFilters: Filters = {
  make: '',
  yearMin: undefined,
  yearMax: undefined,
  priceMin: undefined,
  priceMax: undefined,
};

const defaultSortOption: SortOption = 'price_asc';

export function CarFilters({ onFilterChange, initialFilters = {}, initialSortOption = defaultSortOption, availableMakes }: CarFiltersProps) {
  const { t } = useI18n();
  const [filters, setFilters] = useState<Filters>({ ...defaultFilters, ...initialFilters });
  const [sortOption, setSortOption] = useState<SortOption>(initialSortOption);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value === '' ? undefined : Number(value) }));
  };

  const handleMakeChange = (value: string) => {
    setFilters(prev => ({ ...prev, make: value }));
  };

  const handleSortChange = (value: string) => {
    setSortOption(value as SortOption);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filters, sortOption);
  };
  
  const handleReset = () => {
    setFilters(defaultFilters);
    setSortOption(defaultSortOption);
    onFilterChange(defaultFilters, defaultSortOption);
  };

  useEffect(() => {
    if (JSON.stringify(initialFilters) !== JSON.stringify(defaultFilters) || initialSortOption !== defaultSortOption) {
        onFilterChange({ ...defaultFilters, ...initialFilters }, initialSortOption);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'price_asc', label: t('priceAsc') },
    { value: 'price_desc', label: t('priceDesc') },
    { value: 'year_desc', label: t('yearDesc') },
    { value: 'year_asc', label: t('yearAsc') },
    { value: 'make_asc', label: t('makeAsc') },
    { value: 'make_desc', label: t('makeDesc') },
  ];

  const makeComboboxOptions: ComboboxOption[] = [
    { value: '', label: t('allMakes') }, // Value for "All Makes"
    ...availableMakes.map(make => ({ value: make, label: make }))
  ];

  return (
    <Card className="mb-8 shadow-md border">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <Filter className="h-5 w-5 text-primary" />
          {t('applyFilters')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {/* Make Filter - Replaced with Combobox */}
            <div className="flex-grow">
              <Label htmlFor="make" className="text-sm font-medium">{t('filterByMake')}</Label>
              <Combobox
                options={makeComboboxOptions}
                value={filters.make}
                onChange={handleMakeChange}
                placeholder={t('allMakes')} // Placeholder when no make is selected (i.e., "All Makes")
                searchPlaceholder={t('searchMakePlaceholder')}
                emptyStateMessage={t('noMakeFound')}
                triggerClassName="mt-1"
              />
            </div>

            {/* Year Filter */}
            <div className="flex-grow">
              <Label className="text-sm font-medium">{t('filterByYear')}</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  name="yearMin"
                  placeholder={t('minYear')}
                  value={filters.yearMin || ''}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
                <Input
                  type="number"
                  name="yearMax"
                  placeholder={t('maxYear')}
                  value={filters.yearMax || ''}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>
            </div>

            {/* Price Filter */}
            <div className="flex-grow">
              <Label className="text-sm font-medium">{t('filterByPrice')}</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="number"
                  name="priceMin"
                  placeholder={t('minPrice')}
                  value={filters.priceMin || ''}
                  onChange={handleInputChange}
                  min="0"
                />
                <Input
                  type="number"
                  name="priceMax"
                  placeholder={t('maxPrice')}
                  value={filters.priceMax || ''}
                  onChange={handleInputChange}
                  min="0"
                />
              </div>
            </div>
            
            {/* Sort By */}
            <div className="flex-grow">
              <Label htmlFor="sortOption" className="text-sm font-medium">{t('sortBy')}</Label>
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger id="sortOption" className="mt-1">
                  <SelectValue placeholder={t('selectSort')} />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              <Filter className="mr-2 h-4 w-4" />
              {t('applyFilters')}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} className="w-full sm:w-auto">
              <RotateCcw className="mr-2 h-4 w-4" />
              {t('resetFilters')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
