
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn, Loader2 } from 'lucide-react';

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormData = z.infer<typeof LoginFormSchema>;

const useDocumentTitleEffect = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

export default function LoginPage() {
  const { t } = useI18n();
  const { login, isLoading, currentUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  useDocumentTitleEffect(t('pageTitleLogin'));

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      const redirectUrl = searchParams.get('redirect') || '/';
      router.push(redirectUrl);
    }
  }, [currentUser, router, searchParams]);

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      const redirectUrl = searchParams.get('redirect') || '/';
      router.push(redirectUrl);
    }
    // Error handling is done via toast in AuthContext
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
                <LogIn className="h-7 w-7 text-primary" />
                {t('loginTitle')}
              </CardTitle>
              <CardDescription>{t('loginDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">{t('labelEmail')}</FormLabel>
                    <FormControl>
                      <Input id="email" type="email" placeholder={t('placeholderEmail')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password">{t('labelPassword')}</FormLabel>
                    <FormControl>
                      <Input id="password" type="password" placeholder={t('placeholderPassword')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                {isLoading ? t('loadingRecommendations') : t('buttonLogin')}
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('dontHaveAccount')}{' '}
                <Button variant="link" asChild className="p-0 h-auto">
                  <Link href="/signup" className="font-medium text-primary hover:underline">
                    {t('signupLink')}
                  </Link>
                </Button>
              </p>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
