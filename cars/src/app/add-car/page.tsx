
"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/context/I18nContext';
import { useCarContext } from '@/context/CarContext';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; 
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Loader2 } from 'lucide-react';
import type { AddCarFormData, Car } from '@/types';
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton


const useDocumentTitleEffect = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

const CONSISTENT_CURRENT_YEAR = new Date().getFullYear();

export default function AddCarPage() {
  const { t } = useI18n();
  const { addCar, isLoading: isContextLoading, error: contextError } = useCarContext();
  const { currentUser, isLoading: authIsLoading } = useAuth(); // Get auth state
  const router = useRouter();
  const { toast } = useToast();
  useDocumentTitleEffect(t('pageTitleAddCar'));
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authIsLoading && !currentUser) {
      router.push('/login?redirect=/add-car'); // Redirect to login if not authenticated
    }
  }, [currentUser, authIsLoading, router]);

  const AddCarFormSchema = useMemo(() => z.object({
    make: z.string().min(2, { message: t('labelMake') + " must be at least 2 characters." }),
    model: z.string().min(1, { message: t('labelModel') + " must be at least 1 character." }),
    year: z.string()
      .refine(val => !isNaN(parseInt(val, 10)), { message: t('yearMustBeNumber') })
      .transform(val => parseInt(val, 10))
      .refine(val => val >= 1900 && val <= CONSISTENT_CURRENT_YEAR + 1, { message: t('yearMustBeRealistic').replace('{{currentYear}}', (CONSISTENT_CURRENT_YEAR + 1).toString()) }),
    price: z.string()
      .refine(val => !isNaN(parseFloat(val)), { message: t('priceMustBeNumber') })
      .transform(val => parseFloat(val))
      .refine(val => val > 0, { message: t('priceMustBePositive') }),
    horsepower: z.string()
      .refine(val => !isNaN(parseInt(val, 10)), { message: t('horsepowerMustBeNumber') })
      .transform(val => parseInt(val, 10))
      .refine(val => val > 0, { message: t('horsepowerMustBePositive') }),
    mpg: z.string()
      .refine(val => !isNaN(parseFloat(val)), { message: t('mpgMustBeNumber') })
      .transform(val => parseFloat(val))
      .refine(val => val > 0, { message: t('mpgMustBePositive') }),
    imageUrl: z.string().url({ message: t('imageUrlMustBeValid') }),
    dataAiHint: z.string().refine(value => value.split(' ').length <= 2, { message: t('dataAiHintMaxWords')}).optional().default(''),
    features: z.string().optional().default(''),
  }), [t]);
  
  type ValidatedFormData = z.infer<typeof AddCarFormSchema>;

  const form = useForm<AddCarFormData>({
    resolver: zodResolver(AddCarFormSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      price: '',
      horsepower: '',
      mpg: '',
      imageUrl: 'https://placehold.co/600x400.png',
      dataAiHint: '',
      features: '',
    },
  });

  const onSubmit: SubmitHandler<ValidatedFormData> = async (data) => {
    if (!currentUser) {
      toast({ variant: "destructive", title: t('authError'), description: "You must be logged in to add a car." });
      return;
    }
    setIsSubmitting(true);
    try {
      const newCar: Omit<Car, 'id'> = {
        make: data.make,
        model: data.model,
        year: data.year,
        price: data.price,
        horsepower: data.horsepower,
        mpg: data.mpg,
        imageUrl: data.imageUrl,
        dataAiHint: data.dataAiHint || `${data.make.toLowerCase()} ${data.model.toLowerCase()}`.substring(0, 20).split(' ').slice(0,2).join(' '),
        features: data.features ? data.features.split(',').map(f => f.trim()).filter(f => f) : [],
        // userId: currentUser.uid, // TODO: Add userId when Car type and Firestore rules are updated
      };
      const newCarId = await addCar(newCar);
      if (newCarId) {
        toast({
          title: t('addCarSuccessToastTitle'),
          description: t('addCarSuccessToastDescription', { make: data.make, model: data.model }),
        });
        router.push('/');
      } else {
         toast({
          variant: "destructive",
          title: t('addCarErrorToastTitle'),
          description: contextError || t('addCarErrorToastDescription'),
        });
      }
    } catch (error) {
      console.error("Error adding car:", error);
      toast({
        variant: "destructive",
        title: t('addCarErrorToastTitle'),
        description: t('addCarErrorToastDescription'),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (authIsLoading) {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-6">
        <Skeleton className="h-12 w-1/2" /> 
        <Skeleton className="h-8 w-3/4" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (!currentUser) {
     // This case might be brief due to redirect, but good for robustness
    return (
      <div className="max-w-2xl mx-auto py-8 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">{t('redirectingToLogin')}</p>
      </div>
    );
  }


  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card className="shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                <PlusCircle className="h-7 w-7 text-primary" />
                {t('addCarTitle')}
              </CardTitle>
              <CardDescription>{t('addCarDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="make">{t('labelMake')}</FormLabel>
                      <FormControl>
                        <Input id="make" placeholder={t('placeholderMake')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="model">{t('labelModel')}</FormLabel>
                      <FormControl>
                        <Input id="model" placeholder={t('placeholderModel')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="year">{t('labelYear')}</FormLabel>
                      <FormControl>
                        <Input id="year" type="number" placeholder={t('placeholderYear')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="price">{t('labelPrice')}</FormLabel>
                      <FormControl>
                        <Input id="price" type="number" placeholder={t('placeholderPrice')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="horsepower"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="horsepower">{t('labelHorsepower')}</FormLabel>
                      <FormControl>
                        <Input id="horsepower" type="number" placeholder={t('placeholderHorsepower')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mpg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="mpg">{t('labelMPG')}</FormLabel>
                      <FormControl>
                        <Input id="mpg" type="number" placeholder={t('placeholderMPG')} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="imageUrl">{t('labelImageURL')}</FormLabel>
                    <FormControl>
                      <Input id="imageUrl" placeholder={t('placeholderImageURL')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dataAiHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="dataAiHint">{t('labelDataAiHint')}</FormLabel>
                    <FormControl>
                      <Input id="dataAiHint" placeholder={t('placeholderDataAiHint')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="features">{t('labelFeatures')}</FormLabel>
                    <FormControl>
                      <Textarea id="features" placeholder={t('placeholderFeatures')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting || isContextLoading}>
                {(isSubmitting || isContextLoading) ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="mr-2 h-4 w-4" />
                )}
                {isSubmitting ? t('loadingRecommendations') : t('buttonAddCar')}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
