
"use client";

import Link from 'next/link';
import { useI18n } from '@/context/I18nContext';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { LanguageToggle } from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Car, PlusCircle, Newspaper, Info, LogIn, UserPlus, LogOut, UserCircle, Loader2 } from 'lucide-react'; 

export function Navbar() {
  const { t } = useI18n();
  const { currentUser, logout, isLoading: authLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold mr-auto">
          <Car className="h-6 w-6 text-primary" />
          <span>{t('appName')}</span>
        </Link>
        <nav className="flex items-center gap-1 md:gap-2 flex-wrap justify-end">
          <Button variant="ghost" asChild className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-2 py-1 h-auto">
            <Link href="/">{t('navCatalog')}</Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary px-2 py-1 h-auto">
            <Link href="/recommender">{t('navRecommender')}</Link>
          </Button>
           {currentUser && (
             <Button variant="ghost" asChild className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1 px-2 py-1 h-auto">
              <Link href="/add-car"><PlusCircle className="h-4 w-4"/> {t('navAddCar')}</Link>
            </Button>
           )}
          <Button variant="ghost" asChild className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1 px-2 py-1 h-auto">
           <Link href="/news"><Newspaper className="h-4 w-4"/> {t('navNews')}</Link>
          </Button>
          <Button variant="ghost" asChild className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1 px-2 py-1 h-auto">
            <Link href="/about"><Info className="h-4 w-4"/> {t('navAbout')}</Link>
          </Button>
          
          {authLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-2" />
          ) : currentUser ? (
            <>
              {/* Можно добавить ссылку на профиль пользователя, если он есть */}
              {/* <Button variant="ghost" asChild className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1 px-2 py-1 h-auto">
                <Link href="/profile"> <UserCircle className="h-4 w-4" /> {currentUser.email?.split('@')[0] || t('myProfile')} </Link>
              </Button> */}
              <span className="text-sm text-muted-foreground hidden md:inline-block mx-2 truncate max-w-[100px] lg:max-w-[150px]" title={currentUser.email || ''}>
                {currentUser.email}
              </span>
              <Button variant="ghost" onClick={logout} className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1 px-2 py-1 h-auto">
                <LogOut className="h-4 w-4" /> {t('navLogout')}
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary flex items-center gap-1 px-2 py-1 h-auto">
                <Link href="/login"><LogIn className="h-4 w-4"/> {t('navLogin')}</Link>
              </Button>
              <Button variant="outline" asChild className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 px-2 py-1 h-auto">
                 <Link href="/signup"><UserPlus className="h-4 w-4"/> {t('navSignup')}</Link>
              </Button>
            </>
          )}
          <LanguageToggle />
        </nav>
      </div>
    </header>
  );
}
