
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { I18nProvider } from '@/context/I18nContext';
import { CarProvider } from '@/context/CarContext';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AutoTrend - Find Your Next Car',
  description: 'Car catalog and recommendation engine.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <I18nProvider>
          <AuthProvider> {/* Wrap with AuthProvider */}
            <CarProvider>
              <Navbar />
              <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {children}
              </main>
              <Toaster />
            </CarProvider>
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
