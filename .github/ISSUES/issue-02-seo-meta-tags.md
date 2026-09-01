# [FE-02] SEO: Dynamic Meta Tags (Title, Description, Open Graph) per Halaman

**Labels**: `feature`, `frontend`, `seo`, `priority-critical`
**Assignees**: -
**Milestone**: Phase 1 — Foundation

---

## 🎯 Tujuan

Tambahkan dynamic `<title>`, `<meta description>`, dan `<meta>` Open Graph di setiap halaman agar artikel bisa ter-index Google dan tampil baik saat dibagikan di WhatsApp/media sosial.

---

## 📍 Lokasi File yang Perlu Diubah

```
kajian/
├── package.json                                  ← install react-helmet-async
├── index.html                                    ← hapus title statis
└── src/
    ├── main.tsx                                  ← wrap dengan HelmetProvider
    ├── pages/
    │   ├── public/
    │   │   ├── HomePage.tsx                      ← tambah meta tag
    │   │   └── ArticleDetailPage.tsx             ← tambah meta tag dinamis
    │   └── admin/
    │       └── AdminLoginPage.tsx                ← tambah noindex meta
    └── shared/components/common/
        └── DynamicMeta.tsx                       ← BUAT komponen baru
```

---

## ✅ Checklist Tugas

### Step 1: Install Dependency

Di folder `kajian/`:
```bash
npm install react-helmet-async
```

### Step 2: Wrap App dengan HelmetProvider

Buka `src/main.tsx` dan tambahkan:

```tsx
import { HelmetProvider } from 'react-helmet-async';

// Wrap <App /> dengan HelmetProvider:
createRoot(document.getElementById('root')!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
```

### Step 3: Buat Komponen `DynamicMeta.tsx`

Buat file: `src/shared/components/common/DynamicMeta.tsx`

```tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface DynamicMetaProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  noIndex?: boolean;
}

const SITE_NAME = 'Portal Kajian Islam';
const DEFAULT_DESC = 'Baca artikel dan materi kajian Islam terpercaya dari berbagai ulama dan ustadz';
const DEFAULT_IMAGE = '/og-image.jpg';  // Nanti buat gambar default ini

export const DynamicMeta: React.FC<DynamicMetaProps> = ({
  title,
  description = DEFAULT_DESC,
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  noIndex = false,
}) => {
  const fullTitle = title === SITE_NAME ? title : `${title} — ${SITE_NAME}`;
  const canonicalUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph — untuk WhatsApp, Facebook, dll */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="id_ID" />

      {/* Twitter/X Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
    </Helmet>
  );
};
```

### Step 4: Tambah DynamicMeta di Setiap Halaman

**`src/pages/public/ArticleDetailPage.tsx`**

Tambahkan setelah baris `const { data: article, ... }`:
```tsx
import { DynamicMeta } from '@/shared/components/common/DynamicMeta';

// Di dalam JSX, tambahkan di atas return (setelah loading check):
{article && (
  <DynamicMeta
    title={article.title}
    description={article.excerpt || article.content.substring(0, 155) + '...'}
    image={article.coverImage}
    type="article"
  />
)}
```

**`src/pages/public/HomePage.tsx`**

Tambahkan di dalam JSX:
```tsx
import { DynamicMeta } from '@/shared/components/common/DynamicMeta';

// Di dalam return, sebelum <PublicNavbar>:
<DynamicMeta
  title="Portal Kajian Islam"
  description="Baca artikel dan materi kajian Islam dari berbagai ulama terpercaya. Topik: Hukum Islam, Aqidah, Hadits, Sirah, Khutbah, dan lainnya."
/>
```

**`src/pages/admin/AdminLoginPage.tsx`**

```tsx
<DynamicMeta
  title="Admin Login"
  noIndex={true}
/>
```

### Step 5: Update `index.html`

Buka `index.html` di root project kajian. Ubah `<title>` statis menjadi default yang akan di-override:

```html
<!-- Ubah dari: -->
<title>Kajian</title>

<!-- Menjadi: -->
<title>Portal Kajian Islam</title>
<meta name="description" content="Baca artikel dan materi kajian Islam terpercaya" />
```

### Step 6: Verifikasi

- [ ] Buka halaman artikel → check `<title>` di browser tab sudah nama artikel
- [ ] Buka DevTools → Elements → `<head>` → cek tag `og:title`, `og:description`, `og:image`
- [ ] Test di: https://developers.facebook.com/tools/debug/ (paste URL artikel)
- [ ] Test di: https://cards-dev.twitter.com/validator
- [ ] Halaman admin → tidak ada di Google (meta `noindex` aktif)

---

## 📝 Catatan

- Komponen `DynamicMeta` menggunakan `react-helmet-async`, bukan `react-helmet` (yang sudah deprecated)
- Untuk produksi: buat file `public/og-image.jpg` berukuran 1200x630px sebagai default Open Graph image
