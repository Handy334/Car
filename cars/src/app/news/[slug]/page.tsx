
"use client";

import React, { useEffect, useState, use } from 'react'; // Imported 'use'
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, CalendarDays, User, Info } from 'lucide-react';
import type { NewsArticle } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { translations } from '@/lib/i18n'; // Import translations for dynamic title

// Mock data - in a real app, this would come from a CMS or database
// Copied here for simplicity, ideally this would be a shared utility or fetched
const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    slug: 'future-of-electric-cars-2025',
    title: 'The Future of Electric Cars: What to Expect in 2025',
    date: '2024-07-28',
    author: 'Alex Johnson',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'electric car future',
    summary: 'Electric vehicles are rapidly evolving. Discover the upcoming trends, technologies, and models set to hit the market in 2025.',
    content: '<p>The automotive industry is undergoing a seismic shift towards electrification. By 2025, we anticipate even longer ranges, faster charging times, and a wider variety of models, from compact city cars to heavy-duty trucks. Advancements in battery technology, such as solid-state batteries, promise to be game-changers, offering increased energy density and safety.</p><p>Furthermore, autonomous driving features are becoming increasingly integrated with EVs. Level 3 and Level 4 autonomy might become more common in premium electric models, allowing for hands-free driving in certain conditions. Infrastructure will also play a crucial role, with governments and private companies investing heavily in expanding charging networks globally.</p><p>Expect to see more affordable EV options as production scales up and battery costs decrease, making electric mobility accessible to a broader audience. The integration of AI in vehicle management systems will also enhance user experience, optimizing routes, energy consumption, and predictive maintenance.</p>',
  },
  {
    id: '2',
    slug: 'self-driving-trucks-revolution',
    title: 'Self-Driving Trucks: A Revolution in Logistics',
    date: '2024-07-25',
    author: 'Sarah Miller',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'truck autonomous',
    summary: 'Autonomous trucks are poised to transform the logistics industry, promising increased efficiency and safety. What are the latest developments?',
    content: '<p>The concept of trucks navigating highways without a human driver is rapidly moving from science fiction to reality. Companies are heavily investing in autonomous trucking technology, driven by the potential for significant cost savings, improved safety records, and solutions to driver shortages. These systems rely on a sophisticated array of sensors, including LiDAR, radar, cameras, and GPS, coupled with powerful AI algorithms for real-time decision-making.</p><p>While fully autonomous (Level 5) trucks are still some way off for widespread deployment, Level 4 systems, capable of operating without human intervention under specific conditions (e.g., on highways), are undergoing extensive testing. The regulatory landscape is also evolving to accommodate these new technologies, with debates ongoing about safety standards, liability, and job displacement. The transition will likely be gradual, starting with "hub-to-hub" models where autonomous trucks handle long-haul highway segments, and human drivers manage the more complex urban legs.</p>',
  },
  {
    id: '3',
    slug: 'classic-cars-modern-tech',
    title: 'Classic Cars Meet Modern Tech: Restomodding Trends',
    date: '2024-07-22',
    author: 'Chris Davis',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'classic car technology',
    summary: 'Restomodding, the practice of restoring classic cars with modern technology, is gaining popularity. Explore the coolest trends and innovations.',
    content: '<p>Restomodding breathes new life into automotive icons by blending timeless design with contemporary performance, safety, and comfort. Enthusiasts are increasingly opting to upgrade classic cars with modern engines (including electric conversions), advanced suspension systems, powerful brakes, and creature comforts like air conditioning and sophisticated infotainment systems.</p><p>One popular trend is the "EV restomod," where classic petrol-guzzlers are converted to run on electric power, offering silent, emission-free cruising with instant torque. Another is the integration of modern safety features, such as anti-lock brakes, traction control, and even subtle parking sensors, such as anti-lock brakes, traction control, and even subtle parking sensors, making these vintage beauties more practical for daily driving. The interiors often receive a luxurious overhaul with custom upholstery, digital dashboards that mimic analog designs, and high-fidelity sound systems. The goal is to preserve the soul and aesthetic of the classic while enhancing its usability and reliability for the 21st century.</p>',
  },
];


interface NewsArticlePageProps {
  params: Promise<{ slug: string }>; // Updated to expect a Promise
}

const useDocumentTitleEffect = (title: string) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = title;
    }
  }, [title]);
};

export default function NewsArticlePage({ params: paramsPromise }: NewsArticlePageProps) {
  const { t, locale } = useI18n();
  
  // Use React.use to unwrap the params promise
  const params = use(paramsPromise);
  const slug = params.slug; // Access slug from resolved params

  const [article, setArticle] = useState<NewsArticle | null | undefined>(undefined); // undefined: loading, null: not found
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Now 'slug' is the resolved string from params
    const foundArticle = mockNewsArticles.find(art => art.slug === slug);
    setArticle(foundArticle || null);

    if (foundArticle) {
      const date = new Date(foundArticle.date);
      setFormattedDate(new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date));
    }
  }, [slug, locale]); // Depend on the resolved slug and locale

  const pageTitle = article 
    ? translations[locale].newsArticleTitle.replace('{{title}}', article.title)
    : (article === null ? t('articleNotFound') : t('loadingRecommendations'));
  useDocumentTitleEffect(pageTitle);

  if (article === undefined) { // Loading state
    return (
      <div className="container mx-auto py-8 px-4">
        <Skeleton className="h-10 w-36 mb-8 rounded-md" /> {/* Back button skeleton */}
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-xl overflow-hidden">
            <Skeleton className="w-full h-72 md:h-96" /> {/* Image skeleton */}
            <CardHeader className="border-b">
              <Skeleton className="h-9 w-3/4 mb-2 rounded" /> {/* Title skeleton */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <Skeleton className="h-5 w-32 rounded" /> {/* Date skeleton */}
                <Skeleton className="h-5 w-24 rounded" /> {/* Author skeleton */}
              </div>
            </CardHeader>
            <CardContent className="py-6 prose dark:prose-invert max-w-none">
              <Skeleton className="h-6 w-full mb-4 rounded" />
              <Skeleton className="h-6 w-full mb-4 rounded" />
              <Skeleton className="h-6 w-5/6 mb-4 rounded" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (article === null) {
    return (
      <div className="container mx-auto py-12 px-4 flex flex-col items-center text-center">
        <Alert variant="destructive" className="max-w-md shadow-lg">
          <Info className="h-5 w-5" />
          <AlertTitle>{t('articleNotFound')}</AlertTitle>
          <AlertDescription>{t('articleNotFoundDescription')}</AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/news">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('backToNews')}
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button asChild variant="outline" className="mb-8 shadow-sm hover:shadow-md transition-shadow">
        <Link href="/news">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('backToNews')}
        </Link>
      </Button>

      <div className="max-w-3xl mx-auto">
        <Card className="shadow-xl overflow-hidden border">
          <div className="relative w-full h-72 md:h-96 bg-muted">
            <Image
              src={article.imageUrl}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint={article.dataAiHint}
              priority
              className="rounded-t-lg"
            />
          </div>
          <CardHeader className="border-b">
            <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">{article.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
              <div className="flex items-center">
                <CalendarDays className="mr-1.5 h-4 w-4" />
                <span>{formattedDate ? t('publishedDate', {date: formattedDate}) : article.date}</span>
              </div>
              <div className="flex items-center">
                <User className="mr-1.5 h-4 w-4" />
                <span>{t('byAuthor', {author: article.author})}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="py-6 prose dark:prose-invert max-w-none">
            {/* 
              Using dangerouslySetInnerHTML because mock article content contains HTML.
              In a real application with user-generated content or content from a CMS,
              ensure this content is properly sanitized to prevent XSS attacks.
            */}
            <div dangerouslySetInnerHTML={{ __html: article.content }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

