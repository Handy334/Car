
"use client";

import React, { useEffect } from 'react';
import { useI18n } from '@/context/I18nContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const useDocumentTitleEffect = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

export default function AboutPage() {
  const { t } = useI18n();
  useDocumentTitleEffect(t('pageTitleAbout'));

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Info className="h-7 w-7 text-primary" />
            {t('aboutUsTitle')}
          </CardTitle>
          <CardDescription>{t('aboutUsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 prose dark:prose-invert max-w-none">
          <p>
            {t('aboutUsContent').split('\n\n')[0]}
          </p>
          <p>
            {t('aboutUsContent').split('\n\n')[1]}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

    