import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUstadzProfile } from '@/features/ustadz/hooks/useUstadz';
import { PublicNavbar } from '@/shared/components/layout/PublicNavbar';
import { PublicFooter } from '@/shared/components/layout/PublicFooter';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { ArticleSkeleton } from '@/features/articles/components/ArticleSkeleton';
import { DynamicMeta } from '@/shared/components/common/DynamicMeta';
import { Button } from '@/components/ui/button';
import { User, BookOpen, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

export const UstadzProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUstadzProfile(slug || '', page);

  const ustadz = data?.data?.ustadz;
  const articles = data?.data?.articles || [];
  const meta = data?.data?.meta || data?.meta;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-5xl space-y-6">
        {ustadz && (
          <DynamicMeta
            title={`Profil Ust. ${ustadz.name}`}
            description={ustadz.bio || `Daftar artikel dan ceramah oleh Ust. ${ustadz.name}`}
            image={ustadz.avatarUrl}
          />
        )}

        {/* Tombol Kembali */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-xs px-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke Beranda
          </Button>
        </Link>

        {/* Profile Header Loading Skeleton */}
        {isLoading && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-6 rounded-xl border bg-card animate-pulse">
              <div className="h-20 w-20 rounded-full bg-muted" />
              <div className="space-y-2 flex-1">
                <div className="h-6 w-48 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <ArticleSkeleton key={i} />
              ))}
            </div>
          </div>
        )}

        {/* Profile Error / Not Found */}
        {isError && (
          <div className="p-8 text-center border rounded-xl bg-card">
            <p className="font-semibold">Ustadz Tidak Ditemukan</p>
            <p className="text-xs text-muted-foreground mt-1">
              Halaman profil yang Anda cari tidak tersedia.
            </p>
          </div>
        )}

        {!isLoading && ustadz && (
          <>
            {/* Profil Card */}
            <div className="flex flex-col sm:flex-row items-start gap-5 p-5 sm:p-6 rounded-xl border bg-card">
              {/* Avatar */}
              <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-primary/20">
                {ustadz.avatarUrl ? (
                  <img
                    src={ustadz.avatarUrl}
                    alt={ustadz.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-primary/50" />
                )}
              </div>

              {/* Info */}
              <div className="space-y-2 flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                  {ustadz.name}
                </h1>
                {ustadz.bio && (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ustadz.bio}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />
                  <span>{meta?.total || 0} artikel kajian</span>
                </div>
              </div>
            </div>

            {/* Daftar Artikel */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-wide border-b pb-2">
                Artikel oleh {ustadz.name}
              </h2>

              {/* Empty state */}
              {articles.length === 0 && (
                <div className="p-8 text-center border rounded-xl bg-card text-sm text-muted-foreground">
                  Belum ada artikel dari pemateri ini.
                </div>
              )}

              {/* Artikel Grid */}
              {articles.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {articles.map((article: any) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                    onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <PublicFooter />
    </div>
  );
};
