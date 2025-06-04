
"use client";

import React, { useState, useEffect } from 'react';
import { RecommendationForm } from '@/components/RecommendationForm';
import { RecommendationResult } from '@/components/RecommendationResult';
import type { RecommendCarsOutput } from '@/ai/flows/recommend-cars';
import { useI18n } from '@/context/I18nContext';

const useDocumentTitleEffect = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

export default function RecommenderPage() {
  const { t } = useI18n();
  useDocumentTitleEffect(t('pageTitleRecommender'));
  
  const [recommendations, setRecommendations] = useState<RecommendCarsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-8 flex flex-col items-center">
      <RecommendationForm 
        onRecommendationsFetched={setRecommendations} 
        onLoadingChange={setIsLoading}
        onError={setError}
      />
      {(isLoading || error || recommendations) && (
        <RecommendationResult 
          recommendations={recommendations} 
          isLoading={isLoading}
          error={error}
        />
      )}
    </div>
  );
}
