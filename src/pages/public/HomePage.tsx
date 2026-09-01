import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, useLocation, Link } from 'react-router-dom';
import { DynamicMeta } from '@/shared/components/common/DynamicMeta';
import { PublicNavbar } from '@/shared/components/layout/PublicNavbar';
import { PublicFooter } from '@/shared/components/layout/PublicFooter';
import { usePublicArticles } from '@/features/articles/hooks/useArticles';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { ArticleCarousel } from '@/features/articles/components/ArticleCarousel';
import { ArticleSkeleton } from '@/features/articles/components/ArticleSkeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const HUKUM_ISLAM_SET = new Set([
  'Thoharoh',
  'Thaharah & Bersuci',
  'thaharah',
  'Shalat',
  'Shalat & Dzikir',
  'shalat-dzikir',
  'Puasa',
  'Puasa & Ramadhan',
  'puasa-ramadhan',
  'Muamalah',
  'Muamalah & Ekonomi Syariah',
  'muamalah-ekonomi',
  'Haji & Umrah',
  'haji-umrah',
  'Zakat & Sedekah',
  'zakat-sedekah',
  'Jenazah & Ziarah',
  'jenazah-ziarah',
  'Waris',
  'Umum',
]);

export interface CategoryNavInfo {
  parent?: string;
  current: string;
  title: string;
}

const SLUG_LABEL_MAP: Record<string, { parent?: string; current: string; title: string }> = {
  'sirah-sejarah': { parent: 'Sejarah Islam', current: 'Sirah & Sejarah', title: 'SIRAH & SEJARAH ISLAM' },
  'hadits-sunnah': { parent: "Al-Qur'an & Hadits", current: 'Hadits & Sunnah', title: 'HADITS & SUNNAH' },
  'tafsir-al-quran': { parent: "Al-Qur'an & Hadits", current: "Tafsir Al-Qur'an", title: "TAFSIR AL-QUR'AN" },
  'qolbu': { parent: 'Belajar Islam', current: 'Manajemen Qolbu', title: 'MANAJEMEN QOLBU' },
  'jalan-kebenaran': { parent: 'Belajar Islam', current: 'Jalan Kebenaran', title: 'JALAN KEBENARAN' },
  'haji-umrah': { parent: 'Hukum Islam', current: 'Haji & Umrah', title: 'HAJI & UMRAH' },
  'khutbah': { parent: undefined, current: 'Naskah Khutbah', title: 'NASKAH KHUTBAH' },
  'khutbah-jumat': { parent: 'Naskah Khutbah', current: 'Khutbah Jumat', title: 'KHUTBAH JUMAT' },
  'khutbah-id': { parent: 'Naskah Khutbah', current: 'Khutbah Idul Fitri & Adha', title: 'KHUTBAH IDUL FITRI & ADHA' },
  'ceramah-ringkas': { parent: 'Naskah Khutbah', current: 'Ceramah Ringkas', title: 'CERAMAH RINGKAS' },
};

export function getCategoryNavInfo(
  category?: string,
  tag?: string,
  ustadz?: string,
  search?: string
): CategoryNavInfo {
  const activeTag = tag || category;
  if (activeTag) {
    if (activeTag === 'Naskah Khutbah' || activeTag === 'Khutbah' || activeTag === 'khutbah') {
      return { current: 'Naskah Khutbah', title: 'NASKAH KHUTBAH' };
    }
    if (SLUG_LABEL_MAP[activeTag]) {
      return SLUG_LABEL_MAP[activeTag];
    }
    if (HUKUM_ISLAM_SET.has(activeTag)) {
      return { parent: 'Hukum Islam', current: activeTag, title: activeTag.toUpperCase() };
    }
    return { parent: 'Topik Kajian', current: activeTag, title: activeTag.toUpperCase() };
  }

  if (ustadz) {
    return { parent: 'Pemateri', current: ustadz, title: ustadz.toUpperCase() };
  }

  if (search) {
    if (search.toLowerCase() === 'khutbah') {
      return { current: 'Naskah Khutbah', title: 'NASKAH KHUTBAH' };
    }
    return { parent: 'Pencarian', current: `"${search}"`, title: `PENCARIAN: ${search.toUpperCase()}` };
  }

  return { current: 'Daftar Artikel Kajian', title: 'DAFTAR ARTIKEL KAJIAN' };
}

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const routeParams = useParams<{ tagSlug?: string }>();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const isKhutbahRoute = location.pathname.startsWith('/khutbah');
  const selectedCategory = searchParams.get('category') || (isKhutbahRoute && !routeParams.tagSlug ? 'khutbah' : undefined);
  const selectedTag = routeParams.tagSlug || searchParams.get('tag') || undefined;
  const selectedUstadz = searchParams.get('ustadz') || undefined;
  const page = Number(searchParams.get('page')) || 1;

  // Query Data
  const { data: articlesData, isLoading, isError } = usePublicArticles({
    search: debouncedSearch || undefined,
    category: selectedCategory,
    tag: selectedTag,
    ustadz: selectedUstadz,
    page,
    limit: 10,
  });

  const handleUpdateParam = (key: string, value?: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value) {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }
    if (key !== 'page') {
      nextParams.set('page', '1');
    }
    setSearchParams(nextParams);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSearchParams(new URLSearchParams());
  };

  const articles = articlesData?.data || [];
  const meta = articlesData?.meta;
  const navInfo = getCategoryNavInfo(selectedCategory, selectedTag, selectedUstadz, debouncedSearch);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <DynamicMeta
        title="Portal Kajian Islam"
        description="Baca artikel dan materi kajian Islam dari berbagai ulama terpercaya. Topik: Hukum Islam, Aqidah, Hadits, Sirah, Khutbah, dan lainnya."
      />
      <PublicNavbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6 max-w-6xl">
        {/* Main Article Section */}
        <section className="space-y-4 sm:space-y-6">
          {/* Latest Articles Hero Carousel */}
          {!isLoading && !isError && articles.length > 0 && !debouncedSearch && page === 1 && (
            <div className="mb-4 sm:mb-6">
              <ArticleCarousel articles={articles.slice(0, 10)} />
            </div>
          )}

          {/* Category Breadcrumb Navigation */}
          <div className="space-y-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink render={<Link to="/" onClick={handleClearFilters} />}>
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {navInfo.parent && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink
                        render={
                          <Link to={`/?tag=${encodeURIComponent(navInfo.parent)}`} />
                        }
                      >
                        {navInfo.parent}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                )}
                {navInfo.current !== 'Daftar Artikel Kajian' && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{navInfo.current}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>

            {/* Page Header Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-wide uppercase text-foreground">
                {navInfo.title}
              </h1>
              {meta && (
                <span className="text-xs text-muted-foreground font-medium">
                  Menampilkan {articles.length} dari {meta.total} artikel
                </span>
              )}
            </div>
          </div>

          {/* Skeleton Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="p-6 text-center border rounded-xl bg-destructive/5 text-destructive space-y-2">
              <p className="font-semibold text-sm">Gagal memuat artikel kajian</p>
              <p className="text-xs text-muted-foreground">
                Pastikan koneksi backend API berjalan di http://localhost:5000
              </p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && articles.length === 0 && (
            <div className="p-8 sm:p-12 text-center border rounded-xl bg-card space-y-4">
              <div className="space-y-1">
                <h3 className="text-base font-semibold">Artikel Tidak Ditemukan</h3>
                <p className="text-xs text-muted-foreground">
                  Coba sesuaikan kata kunci pencarian atau reset filter navigasi.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={handleClearFilters}>
                Reset Navigasi
              </Button>
            </div>
          )}

          {/* Articles Grid */}
          {!isLoading && !isError && articles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 sm:pt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => handleUpdateParam('page', String(page - 1))}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </Button>

              <span className="text-xs text-muted-foreground px-2">
                Halaman {page} dari {meta.totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= meta.totalPages}
                onClick={() => handleUpdateParam('page', String(page + 1))}
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </section>
      </main>

      <PublicFooter />
    </div>
  );
};


