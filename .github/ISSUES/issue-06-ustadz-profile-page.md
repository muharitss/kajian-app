# [FE-06] Halaman Publik: Profil Ustadz (/ustadz/:slug)

**Labels**: `feature`, `frontend`, `priority-medium`
**Assignees**: -
**Milestone**: Phase 2 — Content Discovery

---

## 🎯 Tujuan

Buat halaman baru `/ustadz/:slug` yang menampilkan profil lengkap seorang ustadz beserta semua artikel yang pernah dia tulis/sampaikan.

> ⚠️ **Prerequisite**: Issue **[BE-03]** (endpoint GET /ustadz/:slug) harus selesai dulu.

---

## 📍 File yang Perlu Dibuat/Diubah

```
kajian/src/
├── pages/public/
│   └── UstadzProfilePage.tsx           ← BUAT baru
├── features/ustadz/
│   ├── api/ustadz.api.ts               ← tambah fungsi getBySlug()
│   └── hooks/useUstadz.ts              ← tambah hook useUstadzProfile()
└── app/router/AppRouter.tsx            ← tambah route baru
```

---

## ✅ Checklist Tugas

### Step 1: Tambah API Call

Buka (atau buat) `src/features/ustadz/api/ustadz.api.ts`:

```typescript
import { api } from '@/shared/lib/axios';

export const ustadzApi = {
  getAll: () => api.get('/ustadz').then(r => r.data),

  // TAMBAHKAN:
  getBySlug: (slug: string, params?: { page?: number; limit?: number }) =>
    api.get(`/ustadz/${slug}`, { params }).then(r => r.data),
};
```

### Step 2: Tambah Hook

Buka `src/features/ustadz/hooks/useUstadz.ts` dan tambahkan:

```typescript
export const useUstadzProfile = (slug: string, page = 1) => {
  return useQuery({
    queryKey: ['ustadz-profile', slug, page],
    queryFn: () => ustadzApi.getBySlug(slug, { page, limit: 10 }),
    enabled: !!slug,
  });
};
```

### Step 3: Buat Halaman `UstadzProfilePage.tsx`

Buat file `src/pages/public/UstadzProfilePage.tsx`:

```tsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useUstadzProfile } from '@/features/ustadz/hooks/useUstadz';
import { PublicNavbar } from '@/shared/components/layout/PublicNavbar';
import { PublicFooter } from '@/shared/components/layout/PublicFooter';
import { ArticleCard } from '@/features/articles/components/ArticleCard';
import { ArticleSkeleton } from '@/features/articles/components/ArticleSkeleton';
import { Button } from '@/components/ui/button';
import { User, BookOpen, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';

export const UstadzProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useUstadzProfile(slug || '', page);

  const ustadz = data?.data?.ustadz;
  const articles = data?.data?.articles || [];
  const meta = data?.data?.meta;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-5xl space-y-6">
        {/* Tombol Kembali */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="text-xs px-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke Beranda
          </Button>
        </Link>

        {/* Profile Header */}
        {isLoading && (
          <div className="flex items-center gap-4 p-6 rounded-xl border bg-card animate-pulse">
            <div className="h-20 w-20 rounded-full bg-muted" />
            <div className="space-y-2 flex-1">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="h-4 w-full bg-muted rounded" />
            </div>
          </div>
        )}

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
            {/* ======================== */}
            {/* Profil Card              */}
            {/* ======================== */}
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

            {/* ======================== */}
            {/* Daftar Artikel           */}
            {/* ======================== */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold uppercase tracking-wide border-b pb-2">
                Artikel oleh {ustadz.name}
              </h2>

              {/* Loading skeleton */}
              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <ArticleSkeleton key={i} />)}
                </div>
              )}

              {/* Empty */}
              {!isLoading && articles.length === 0 && (
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
```

### Step 4: Daftarkan Route di `AppRouter.tsx`

Buka `src/app/router/AppRouter.tsx` (atau file router yang ada). Tambahkan route baru:

```tsx
import { UstadzProfilePage } from '@/pages/public/UstadzProfilePage';

// Di dalam Routes:
<Route path="/ustadz/:slug" element={<UstadzProfilePage />} />
```

### Step 5: Update Link di ArticleCard

Buka `src/features/articles/components/ArticleCard.tsx`. Jika ada nama ustadz yang ditampilkan, buat agar bisa diklik menuju profil:

```tsx
// Cari bagian yang menampilkan nama ustadz
// Ubah dari plain text menjadi Link:
{article.ustadz && (
  <Link
    to={`/ustadz/${article.ustadz.slug}`}
    onClick={(e) => e.stopPropagation()}
    className="hover:text-primary transition-colors"
  >
    Ust. {article.ustadz.name}
  </Link>
)}
```

### Step 6: Verifikasi Manual

- [ ] Buka URL `/ustadz/nama-slug-ustadz`
- [ ] Profil ustadz tampil dengan nama, avatar (atau placeholder), bio
- [ ] Jumlah artikel tampil
- [ ] Grid artikel tampil di bawah
- [ ] Pagination bekerja
- [ ] URL ustadz tidak valid → tampil pesan error yang jelas
- [ ] Klik nama ustadz di ArticleCard → redirect ke halaman profil
