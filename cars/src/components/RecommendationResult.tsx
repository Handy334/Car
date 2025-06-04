
"use client";

import type { RecommendCarsOutput } from '@/ai/flows/recommend-cars';
import { useI18n } from '@/context/I18nContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Info, Loader2, XCircle } from 'lucide-react';

interface RecommendationResultProps {
  recommendations: RecommendCarsOutput | null;
  isLoading: boolean;
  error: string | null;
}

export function RecommendationResult({ recommendations, isLoading, error }: RecommendationResultProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <Card className="mt-8 w-full max-w-2xl mx-auto shadow-lg animate-pulse">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            {t('loadingRecommendations')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-8 max-w-2xl mx-auto">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!recommendations) {
    return null; // No active request, no results yet
  }
  
  if (!recommendations.recommendations || recommendations.recommendations.trim() === "") {
     return (
      <Alert className="mt-8 max-w-2xl mx-auto">
        <Info className="h-4 w-4" />
        <AlertTitle>{t('noRecommendations')}</AlertTitle>
        <AlertDescription>
          {t('Please try again with different preferences.')}
        </AlertDescription>
      </Alert>
    );
  }


  return (
    <Card className="mt-8 w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCircle className="h-5 w-5 text-green-500" />
          {t('recommendations')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
          {recommendations.recommendations}
        </div>
      </CardContent>
    </Card>
  );
}
