import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Home,
  Sun,
  Moon,
  Menu,
  ExternalLink,
  Search,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { useTags } from '@/features/tags/hooks/useTags';
import { useUstadz } from '@/features/ustadz/hooks/useUstadz';

interface PublicNavbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

// Sub-menu Specification & Fallback Exports for Self-Check Tests
// Hardcoded Menu Specifications for Tag-Based Navigation
export const HUKUM_ISLAM_MENU = [
  { name: 'Thoharoh', href: '/hukum-islam/thoharoh', tagSlug: 'thoharoh' },
  { name: 'Shalat', href: '/hukum-islam/shalat', tagSlug: 'shalat' },
  { name: 'Puasa', href: '/hukum-islam/puasa', tagSlug: 'puasa' },
  { name: 'Muamalah', href: '/hukum-islam/muamalah', tagSlug: 'muamalah' },
  { name: 'Haji Umrah', href: '/hukum-islam/haji-umrah', tagSlug: 'haji-umrah' },
  { name: 'Waris', href: '/hukum-islam/waris', tagSlug: 'waris' },
  { name: 'Umum', href: '/hukum-islam/umum', tagSlug: 'umum' },
];

export const BELAJAR_ISLAM_MENU = [
  { name: 'Aqidah', href: '/belajar-islam/aqidah', tagSlug: 'aqidah' },
  { name: 'Akhlaq', href: '/belajar-islam/akhlaq', tagSlug: 'akhlaq' },
  { name: 'Amalan', href: '/belajar-islam/amalan', tagSlug: 'amalan' },
  { name: 'Keluarga', href: '/belajar-islam/keluarga', tagSlug: 'keluarga' },
  { name: 'Muslimah', href: '/belajar-islam/muslimah', tagSlug: 'muslimah' },
  { name: "Tafsir Al-Qur'an", href: '/belajar-islam/tafsir-al-quran', tagSlug: 'tafsir-al-quran' },
  { name: 'Teladan', href: '/belajar-islam/teladan', tagSlug: 'teladan' },
  { name: 'Jalan Kebenaran', href: '/belajar-islam/jalan-kebenaran', tagSlug: 'jalan-kebenaran' },
  { name: 'Manajemen Qolbu', href: '/belajar-islam/qolbu', tagSlug: 'qolbu' },
];

export const BELAJAR_ISLAM_SUBMENUS = [
  {
    title: 'Hukum Islam',
    headerHref: '/hukum-islam',
    items: HUKUM_ISLAM_MENU.map((i) => i.name),
  },
  {
    title: 'Belajar Islam',
    headerHref: '/belajar-islam',
    items: BELAJAR_ISLAM_MENU.map((i) => i.name),
  },
];

export const KHUTBAH_CATEGORIES = [
  {
    id: 'kategori',
    label: 'Kategori Kajian',
    sampleTitles: ['Aqidah', 'Fiqih', 'Akhlaq', 'Muamalah', 'Tafsir'],
  },
  {
    id: 'ustadz',
    label: 'Pemateri / Ustadz',
    sampleTitles: ['Ustadz Dr. Firanda Andirja', 'Ustadz Abduh Tuasikal', 'Ustadz Khalid Basalamah'],
  },
  {
    id: 'tag',
    label: 'Tag Populer',
    sampleTitles: ['Shalat', 'Puasa', 'Ramadhan', 'Adab'],
  },
  {
    id: 'khutbah',
    label: 'Naskah Khutbah',
    sampleTitles: ['Khutbah Jumat', 'Khutbah Idul Fitri', 'Khutbah Idul Adha'],
  },
];

export const EXTERNAL_LINKS = [
  { label: 'Semua Kajian', href: '/' },
  { label: 'Arsip Khutbah', href: '/?search=khutbah' },
  { label: 'Daftar Ustadz', href: '/?search=ustadz' },
  { label: 'Tazkiyatun Nufus', href: '/hukum-islam/akhlaq' },
  { label: 'E-Book & Faida', href: '/hukum-islam/umum' },
];

export const PublicNavbar: React.FC<PublicNavbarProps> = ({ searchQuery, onSearchChange }) => {
  const navigate = useNavigate();

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return document.documentElement.classList.contains('dark');
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 text-foreground backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-xs">
      <div className="container mx-auto px-3 sm:px-4 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Section: Home Link, Logo & Desktop Navigation */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="text-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground h-8 w-8 sm:h-9 sm:w-9"
            title="Beranda Kajian"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>

          <Link to="/" className="font-bold text-sm sm:text-lg text-primary tracking-tight mr-1 sm:mr-2">
            Kajian
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                {/* 1. Menu Desktop 1: Hukum Islam */}
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-9 items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors text-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground gap-1.5 outline-none cursor-pointer">
                      <span>Hukum Islam</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-48 bg-popover text-popover-foreground border-border p-2 space-y-0.5 shadow-md"
                    >
                      <div className="text-xs font-semibold text-primary uppercase tracking-wider border-b border-border pb-1 mb-1 px-2">
                        Hukum Islam
                      </div>
                      {HUKUM_ISLAM_MENU.map((item) => (
                        <DropdownMenuItem
                          key={item.name}
                          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        >
                          <Link to={item.href} className="text-xs w-full block">
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>

                {/* 2. Menu Desktop 2: Belajar Islam */}
                <NavigationMenuItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="inline-flex h-9 items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors text-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground gap-1.5 outline-none cursor-pointer">
                      <span>Belajar Islam</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-52 bg-popover text-popover-foreground border-border p-2 space-y-0.5 shadow-md"
                    >
                      <div className="text-xs font-semibold text-primary uppercase tracking-wider border-b border-border pb-1 mb-1 px-2">
                        Belajar Islam
                      </div>
                      {BELAJAR_ISLAM_MENU.map((item) => (
                        <DropdownMenuItem
                          key={item.name}
                          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground cursor-pointer"
                        >
                          <Link to={item.href} className="text-xs w-full block">
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Direct Single Links */}
            <div className="h-4 w-px bg-border mx-1" />
            <div className="flex items-center gap-1">
              <Link
                to="/?search=khutbah"
                className="px-2.5 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors font-medium"
              >
                Khutbah
              </Link>
              <Link
                to="/hukum-islam/shalat"
                className="px-2.5 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors font-medium"
              >
                Fiqih
              </Link>
              <Link
                to="/belajar-islam/aqidah"
                className="px-2.5 py-1.5 text-xs text-foreground/80 hover:text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors font-medium"
              >
                Aqidah
              </Link>
            </div>
          </nav>
        </div>

        {/* Right Section: Search Trigger, Skin Toggle & Admin Button */}
        <div className="flex items-center gap-2">
          {onSearchChange !== undefined && (
            <div className="relative max-w-xs hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Cari kajian / ustadz..."
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-36 md:w-48 h-8 pl-8 pr-3 text-xs bg-muted/50 border-border text-foreground focus:border-primary"
              />
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/gate-admin-x9/login')}
            className="text-muted-foreground hover:text-foreground hover:bg-accent hidden sm:flex items-center gap-1 text-xs"
            title="Kelola Konten Admin"
          >
            <Lock className="h-3.5 w-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground/80 hover:text-foreground hover:bg-accent"
            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-foreground/80" />}
          </Button>

          {/* Mobile Navigation Sheet (Drawer) */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-lg text-foreground hover:bg-accent outline-none">
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-border text-foreground p-4 space-y-4">
              <SheetHeader>
                <SheetTitle className="text-primary text-left font-bold text-base">
                  Navigasi Kajian
                </SheetTitle>
              </SheetHeader>

              {onSearchChange !== undefined && (
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    type="text"
                    placeholder="Cari materi kajian..."
                    value={searchQuery || ''}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full h-9 pl-9 pr-3 text-sm bg-muted/50 border-border text-foreground"
                  />
                </div>
              )}

              {/* Accordion Menu in Mobile Drawer */}
              <Accordion>
                <AccordionItem value="hukum-islam">
                  <AccordionTrigger className="hover:no-underline py-2.5 text-sm font-medium text-foreground">
                    <span>Hukum Islam</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-3 text-xs">
                    <div className="grid grid-cols-2 gap-1.5 pl-2">
                      {HUKUM_ISLAM_MENU.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-1 text-foreground/80 hover:text-primary transition-colors"
                        >
                          • {item.name}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="belajar-islam">
                  <AccordionTrigger className="hover:no-underline py-2.5 text-sm font-medium text-foreground">
                    <span>Belajar Islam</span>
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-3 text-xs">
                    <div className="grid grid-cols-2 gap-1.5 pl-2">
                      {BELAJAR_ISLAM_MENU.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-1 text-foreground/80 hover:text-primary transition-colors"
                        >
                          • {item.name}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Subdomain Links in Drawer */}
              <div className="pt-2 border-t border-border space-y-1">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-1">
                  Tautan Tambahan
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {EXTERNAL_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-foreground/80 hover:text-primary flex items-center justify-between transition-colors"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
