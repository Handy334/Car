
"use client";

import Image from 'next/image';
import Link from 'next/link';
import type { Car } from '@/types';
import { useI18n } from '@/context/I18nContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Droplets, Gauge, CalendarDays, DollarSign } from 'lucide-react'; // Added CalendarDays, DollarSign

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const { t, locale } = useI18n();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(price);
  };

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl border">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={car.imageUrl}
            alt={`${car.make} ${car.model}`}
            layout="fill"
            objectFit="cover"
            data-ai-hint={car.dataAiHint}
            className="rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <CardTitle className="text-xl font-semibold tracking-tight">
          {car.make} {car.model}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground flex items-center mt-1">
            <CalendarDays className="mr-1.5 h-4 w-4" /> {car.year}
        </CardDescription>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Gauge className="h-4 w-4 text-primary/80" /> {t('horsepower')}:
            </span>
            <span className="font-medium">{car.horsepower} {t('hpUnit', {count: car.horsepower})}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Droplets className="h-4 w-4 text-primary/80" /> {t('mpg')}:
            </span>
            <span className="font-medium">{car.mpg} {t('mpgUnit', {count: car.mpg})}</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-1">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="h-4 w-4 text-primary/80" /> {t('priceLabel')}:
            </span>
            <span className="font-semibold text-primary text-base">{formatPrice(car.price)}</span>
          </div>
        </div>
        
        {car.features && car.features.length > 0 && (
          <div className="mt-4">
            <h4 className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{t('topFeatures')}</h4>
            <ul className="mt-1.5 space-y-1 text-xs text-foreground/80">
              {car.features.slice(0, 2).map(feature => (
                <li key={feature} className="truncate">
                  <span className="inline-block mr-1.5">&#8226;</span>{feature}
                </li>
              ))}
               {car.features.length > 2 && <li className="text-muted-foreground italic">+{car.features.length - 2} {t('moreFeatures')}</li>}
            </ul>
          </div>
        )}

      </CardContent>
      <CardFooter className="p-6 pt-0 border-t mt-auto">
        <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground transition-colors">
          <Link href={`/cars/${car.id}`}>{t('viewDetails')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
