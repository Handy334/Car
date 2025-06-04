
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { CarCard } from '@/components/CarCard';
import { CarFilters } from '@/components/CarFilters';
import { useCarContext } from '@/context/CarContext'; 
import type { Car, Filters, SortOption } from '@/types';
import { useI18n } from '@/context/I18nContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ListFilter, Loader2, AlertTriangle } from 'lucide-react'; // Added Loader2 and AlertTriangle
import { Skeleton } from '@/components/ui/skeleton'; // Added Skeleton

function applyFiltersAndSort(cars: Car[], filters: Filters, sortOption: SortOption): Car[] {
  let filteredCars = [...cars]; 

  if (filters.make) {
    filteredCars = filteredCars.filter(car => car.make === filters.make);
  }
  if (filters.yearMin) {
    filteredCars = filteredCars.filter(car => car.year >= filters.yearMin!);
  }
  if (filters.yearMax) {
    filteredCars = filteredCars.filter(car => car.year <= filters.yearMax!);
  }
  if (filters.priceMin) {
    filteredCars = filteredCars.filter(car => car.price >= filters.priceMin!);
  }
  if (filters.priceMax) {
    filteredCars = filteredCars.filter(car => car.price <= filters.priceMax!);
  }

  switch (sortOption) {
    case 'price_asc':
      filteredCars.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      filteredCars.sort((a, b) => b.price - a.price);
      break;
    case 'year_asc':
      filteredCars.sort((a, b) => a.year - b.year);
      break;
    case 'year_desc':
      filteredCars.sort((a, b) => b.year - a.year);
      break;
    case 'make_asc':
      filteredCars.sort((a, b) => a.make.localeCompare(b.make));
      break;
    case 'make_desc':
      filteredCars.sort((a, b) => b.make.localeCompare(a.make));
      break;
  }

  return filteredCars;
}

const useDocumentTitleEffect = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};


export default function CatalogPage() {
  const { t } = useI18n();
  const { cars: allCarsFromContext, isLoading, error } = useCarContext(); 
  useDocumentTitleEffect(t('pageTitleCatalog'));

  const [currentFilters, setCurrentFilters] = useState<Filters>({ make: '' });
  const [currentSortOption, setCurrentSortOption] = useState<SortOption>('price_asc');

  const handleFilterChange = (filters: Filters, sortOption: SortOption) => {
    setCurrentFilters(filters);
    setCurrentSortOption(sortOption);
  };

  const displayedCars = useMemo(() => {
    if (isLoading || error) return []; // Don't process if loading or error
    return applyFiltersAndSort(allCarsFromContext, currentFilters, currentSortOption);
  }, [allCarsFromContext, currentFilters, currentSortOption, isLoading, error]);
  
  const carMakes = useMemo(() => {
    if (isLoading || error) return [];
    return Array.from(new Set(allCarsFromContext.map(car => car.make))).sort();
  }, [allCarsFromContext, isLoading, error]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 w-full rounded-lg shadow-md" /> {/* Skeleton for filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-0 rounded-lg border bg-card text-card-foreground shadow-lg overflow-hidden">
              <Skeleton className="h-48 w-full" /> {/* Roughly CarCard image height */}
              <div className="p-6 space-y-3">
                <Skeleton className="h-6 w-3/4" /> {/* Title */}
                <Skeleton className="h-4 w-1/2" /> {/* Year */}
                <div className="mt-4 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                </div>
              </div>
              <div className="p-6 pt-0">
                <Skeleton className="h-10 w-full" /> {/* Button */}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <Alert variant="destructive" className="max-w-md shadow-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{t('errorFetchingRecommendations')}</AlertTitle> 
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <CarFilters onFilterChange={handleFilterChange} availableMakes={carMakes} initialFilters={currentFilters} initialSortOption={currentSortOption} />

      {displayedCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedCars.map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      ) : (
        <Alert className="shadow-md">
          <ListFilter className="h-4 w-4" />
          <AlertTitle>{t('noRecommendations')}</AlertTitle>
          <AlertDescription>
            {t('Try adjusting your filters or view all cars.')} 
            { allCarsFromContext.length === 0 && !isLoading && " " + t('noCarsInCatalogYet')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

