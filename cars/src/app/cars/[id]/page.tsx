
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react'; 
import { useCarContext } from '@/context/CarContext'; 
import type { Car } from '@/types';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, DollarSign, Gauge, Droplets, ListChecks, Info, Zap, Loader2, AlertTriangle, CalendarDays } from 'lucide-react';
import { translations } from '@/lib/i18n';
import { Skeleton } from '@/components/ui/skeleton';


interface CarDetailsPageProps {
  params: { id: string };
}

const useDocumentTitleEffect = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};


export default function CarDetailsPage({ params }: CarDetailsPageProps) {
  const { t, locale } = useI18n();
  const { getCarById, isLoading: isContextLoadingInitial, error: contextError } = useCarContext(); 
  const carId = params.id;
  
  const [car, setCar] = useState<Car | null | undefined>(undefined); // undefined: initial, null: not found, Car: found
  const [isLoadingCar, setIsLoadingCar] = useState(true);

  useEffect(() => {
    const fetchCar = async () => {
      if (!carId) {
        setIsLoadingCar(false);
        setCar(null); // No ID, so not found
        return;
      }
      setIsLoadingCar(true);
      try {
        const fetchedCar = await getCarById(carId);
        setCar(fetchedCar || null); // If getCarById returns undefined, set to null (not found)
      } catch (err) {
        console.error("Error fetching car details:", err);
        setCar(null); // Error means not found or not accessible
      } finally {
        setIsLoadingCar(false);
      }
    };

    fetchCar();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, getCarById]); // getCarById is stable from context usually, but good to include

  const effectiveIsLoading = isLoadingCar || (isContextLoadingInitial && car === undefined);

  const pageTitle = car && car !== null
    ? translations[locale].pageTitleCarDetails.replace('{{make}}', car.make).replace('{{model}}', car.model)
    : (effectiveIsLoading ? t('loadingRecommendations') : translations[locale].carNotFoundTitle);
  useDocumentTitleEffect(pageTitle);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  if (effectiveIsLoading) {
    return (
       <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-32 mb-8 rounded-md" /> {/* Back button skeleton */}
        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden shadow-2xl rounded-xl">
            <Skeleton className="relative w-full h-72 md:h-96" /> {/* Image skeleton */}
            <CardHeader className="p-6 border-b">
              <Skeleton className="h-9 w-3/4 mb-2 rounded" /> {/* Title skeleton */}
              <Skeleton className="h-6 w-1/4 rounded" /> {/* Subtitle skeleton (Year) */}
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div>
                <Skeleton className="h-7 w-1/3 mb-3 rounded" /> {/* Price label skeleton */}
                <Skeleton className="h-10 w-1/2 rounded" /> {/* Price value skeleton */}
              </div>
              
              <div>
                <Skeleton className="h-7 w-1/3 mb-4 rounded" /> {/* Specs label skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md">
                  <Skeleton className="h-14 w-full rounded-lg" />
                  <Skeleton className="h-14 w-full rounded-lg" />
                </div>
              </div>

              <div>
                <Skeleton className="h-7 w-1/3 mb-3 rounded" /> {/* Features label skeleton */}
                <div className="flex flex-wrap gap-2 mt-2">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-20 rounded-full" />
                  <Skeleton className="h-8 w-28 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  if (contextError && car === null) { 
     return (
      <div className="container mx-auto py-12 px-4 flex flex-col items-center text-center">
        <Alert variant="destructive" className="max-w-md shadow-lg">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>{t('errorFetchingRecommendations')}</AlertTitle>
          <AlertDescription>{contextError}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToCatalog')}
          </Link>
        </Button>
      </div>
    );
  }

  if (car === null) { // Explicitly null means car was not found after trying
    return (
      <div className="container mx-auto py-12 px-4 flex flex-col items-center text-center">
        <Alert variant="destructive" className="max-w-md shadow-lg">
          <Info className="h-5 w-5" />
          <AlertTitle>{t('carNotFoundTitle')}</AlertTitle>
          <AlertDescription>{t('carNotFoundDescription')}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToCatalog')}
          </Link>
        </Button>
      </div>
    );
  }
  
  // Should not happen if logic above is correct, but as a fallback.
  if (!car) { 
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg">{t('loadingRecommendations')}</p>
        </div>
      );
  }


  return (
    <div className="container mx-auto py-8 px-4">
      <Button asChild variant="outline" className="mb-8 shadow-sm hover:shadow-md transition-shadow">
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToCatalog')}
        </Link>
      </Button>

      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden shadow-2xl rounded-xl border">
          <div className="relative w-full h-72 md:h-96 bg-muted">
            <Image
              src={car.imageUrl}
              alt={`${car.make} ${car.model}`}
              layout="fill"
              objectFit="cover"
              data-ai-hint={car.dataAiHint}
              priority 
              className="rounded-t-xl"
            />
          </div>
          <CardHeader className="p-6 border-b bg-card">
            <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">{car.make} {car.model}</CardTitle>
            <div className="flex items-center text-lg text-muted-foreground mt-1">
                <CalendarDays className="mr-2 h-5 w-5" />
                <span>{t('yearLabel')}: {car.year}</span>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-2 flex items-center text-primary">
                <DollarSign className="mr-2 h-6 w-6" />
                {t('priceLabel')}
              </h3>
              <p className="text-4xl font-bold text-primary">{formatPrice(car.price)}</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Zap className="mr-2 h-6 w-6 text-muted-foreground" /> 
                {t('specifications')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md">
                <div className="flex items-center p-4 bg-secondary/60 rounded-lg shadow-sm border">
                  <Gauge className="mr-3 h-6 w-6 text-primary" /> 
                  <div>
                    <span className="text-sm text-muted-foreground">{t('horsepower')}</span>
                    <p className="font-semibold text-lg">{car.horsepower} {t('hpUnit', {count: car.horsepower})}</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-secondary/60 rounded-lg shadow-sm border">
                  <Droplets className="mr-3 h-6 w-6 text-primary" /> 
                   <div>
                    <span className="text-sm text-muted-foreground">{t('mpg')}</span>
                    <p className="font-semibold text-lg">{car.mpg} {t('mpgUnit', {count: car.mpg})}</p>
                  </div>
                </div>
              </div>
            </div>

            {car.features && car.features.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <ListChecks className="mr-2 h-6 w-6 text-muted-foreground" />
                  {t('allFeatures')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {car.features.map((feature) => (
                    <Badge key={feature} variant="secondary" className="text-sm px-3 py-1.5 rounded-full shadow-sm border">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
             {!car.features || car.features.length === 0 && (
                <div>
                    <h3 className="text-xl font-semibold mb-3 flex items-center">
                        <ListChecks className="mr-2 h-6 w-6 text-muted-foreground" />
                        {t('allFeatures')}
                    </h3>
                    <p className="text-muted-foreground">{t('noFeaturesListed')}</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

