
"use client";

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Loader2 } from 'lucide-react';
import type { RecommendCarsOutput } from '@/ai/flows/recommend-cars';
import { getCarRecommendationsAction } from '@/app/recommender/actions';
import { useToast } from "@/hooks/use-toast";

const RecommendationFormSchema = z.object({
  preferences: z.string().min(10, { message: "Please describe your preferences in at least 10 characters." }),
});

type RecommendationFormData = z.infer<typeof RecommendationFormSchema>;

interface RecommendationFormProps {
  onRecommendationsFetched: (recommendations: RecommendCarsOutput | null) => void;
  onLoadingChange: (isLoading: boolean) => void;
  onError: (errorMessage: string | null) => void;
}

export function RecommendationForm({ onRecommendationsFetched, onLoadingChange, onError }: RecommendationFormProps) {
  const { t } = useI18n();
  const { toast } = useToast();

  const form = useForm<RecommendationFormData>({
    resolver: zodResolver(RecommendationFormSchema),
    defaultValues: {
      preferences: '',
    },
  });

  const onSubmit: SubmitHandler<RecommendationFormData> = async (data) => {
    onLoadingChange(true);
    onError(null);
    onRecommendationsFetched(null);
    try {
      const result = await getCarRecommendationsAction({ preferences: data.preferences });
      onRecommendationsFetched(result);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      const errorMessage = t('errorFetchingRecommendations');
      onError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Lightbulb className="h-6 w-6 text-primary" />
              {t('recommendationEngine')}
            </CardTitle>
            <CardDescription>{t('preferencesPlaceholder')}</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="preferences"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="preferences" className="sr-only">{t('preferencesPlaceholder')}</FormLabel>
                  <FormControl>
                    <Textarea
                      id="preferences"
                      placeholder={t('preferencesPlaceholder')}
                      rows={5}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t('getRecommendations')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
