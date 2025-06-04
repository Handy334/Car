
"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useI18n } from '@/context/I18nContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Loader2 } from 'lucide-react';

const SignupFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  // confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }), // Optional: add confirm password
})
// .refine(data => data.password === data.confirmPassword, { // Optional: add confirm password
//   message: "Passwords do not match.",
//   path: ["confirmPassword"],
// });


type SignupFormData = z.infer<typeof SignupFormSchema>;

const useDocumentTitleEffect = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

export default function SignupPage() {
  const { t } = useI18n();
  const { signup, isLoading, currentUser } = useAuth();
  const router = useRouter();
  useDocumentTitleEffect(t('pageTitleSignup'));

  const form = useForm<SignupFormData>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: '',
      password: '',
      // confirmPassword: '', // Optional: add confirm password
    },
  });

  useEffect(() => {
    if (currentUser) {
      router.push('/'); // Redirect if already logged in
    }
  }, [currentUser, router]);

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    await signup(data.email, data.password);
    // Error handling is done via toast in AuthContext
    // Success will redirect via useEffect or AuthContext
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
                <UserPlus className="h-7 w-7 text-primary" />
                {t('signupTitle')}
              </CardTitle>
              <CardDescription>{t('signupDescription')}</CardDescription>
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
              {/* Optional: add confirm password field */}
              {/* <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="confirmPassword">{t('labelConfirmPassword')}</FormLabel>
                    <FormControl>
                      <Input id="confirmPassword" type="password" placeholder={t('placeholderConfirmPassword')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isLoading ? t('loadingRecommendations') : t('buttonSignup')}
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('alreadyHaveAccount')}{' '}
                <Button variant="link" asChild className="p-0 h-auto">
                <Link href="/login" className="font-medium text-primary hover:underline">
                  {t('loginLink')}
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
