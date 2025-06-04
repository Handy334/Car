
"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '@/context/I18nContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Newspaper, CalendarDays, User, AlertCircle } from 'lucide-react';
import type { NewsArticle } from '@/types';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const useDocumentTitleEffect = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

// Mock data for news articles - in a real app, this would come from a CMS or database
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
    content: '<p>Restomodding breathes new life into automotive icons by blending timeless design with contemporary performance, safety, and comfort. Enthusiasts are increasingly opting to upgrade classic cars with modern engines (including electric conversions), advanced suspension systems, powerful brakes, and creature comforts like air conditioning and sophisticated infotainment systems.</p><p>One popular trend is the "EV restomod," where classic petrol-guzzlers are converted to run on electric power, offering silent, emission-free cruising with instant torque. Another is the integration of modern safety features, such as anti-lock brakes, traction control, and even subtle parking sensors, making these vintage beauties more practical for daily driving. The interiors often receive a luxurious overhaul with custom upholstery, digital dashboards that mimic analog designs, and high-fidelity sound systems. The goal is to preserve the soul and aesthetic of the classic while enhancing its usability and reliability for the 21st century.</p>',
  },
];

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
  const { t, locale } = useI18n();
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // Client-side date formatting to avoid hydration issues
    const date = new Date(article.date);
    setFormattedDate(new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(date));
  }, [article.date, locale]);

  return (
    <Card className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl border">
      <CardHeader className="p-0">
        <Link href={`/news/${article.slug}`} className="block">
          <div className="relative h-48 w-full bg-muted">
            <Image
              src={article.imageUrl}
              alt={article.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint={article.dataAiHint}
              className="rounded-t-lg"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-6">
        <Link href={`/news/${article.slug}`} className="block">
          <CardTitle className="text-xl font-semibold tracking-tight hover:text-primary transition-colors">
            {article.title}
          </CardTitle>
        </Link>
        <div className="text-xs text-muted-foreground mt-2 space-y-1">
            <div className="flex items-center">
                <CalendarDays className="mr-1.5 h-3.5 w-3.5" />
                <span>{formattedDate ? t('publishedDate', { date: formattedDate }) : article.date}</span>
            </div>
            <div className="flex items-center">
                <User className="mr-1.5 h-3.5 w-3.5" />
                <span>{t('byAuthor', { author: article.author })}</span>
            </div>
        </div>
        <CardDescription className="mt-3 text-sm text-foreground/80 line-clamp-3">
          {article.summary}
        </CardDescription>
      </CardContent>
      <CardFooter className="p-6 pt-0 border-t mt-auto">
        <Button asChild variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground transition-colors">
          <Link href={`/news/${article.slug}`}>{t('readMore')}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function NewsPage() {
  const { t } = useI18n();
  useDocumentTitleEffect(t('pageTitleNews'));

  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    // Simulate fetching data or just set it on client side to ensure hydration safety for initial empty state
    setArticles(mockNewsArticles);
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl flex items-center justify-center gap-3">
          <Newspaper className="h-8 w-8 text-primary" />
          {t('newsTitle')}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
          {t('aboutUsDescription')} {/* Using existing translation key for sub-description */}
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <Alert className="shadow-md max-w-lg mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{t('noNewsArticles')}</AlertTitle>
          <AlertDescription>
            {t('newsComingSoon')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
