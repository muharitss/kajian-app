# Technical Architecture Document - Frontend (Feature-Driven / Feature-Sliced Architecture)

## 1. Tech Stack Overview
- **Core**: React 18/19 + Vite + TypeScript
- **Styling & UI**: TailwindCSS + Shadcn UI + Lucide React Icons
- **State Management**:
  - **Server State & Caching**: TanStack Query v5 (React Query)
  - **Client State**: Zustand (Global UI, Auth Token)
- **Form & Validation**: React Hook Form + Zod
- **Routing**: React Router v6
- **HTTP Client**: Axios dengan kustomisasi Interceptor
- **Utilities**: `clsx`, `tailwind-merge`, `date-fns`

---

## 2. Architecture Pattern: Feature-Driven Architecture
Frontend menggunakan pola **Feature-Driven Architecture** (arsitektur berbasis modul fitur). Semua kode yang berkaitan dengan satu fitur spesifik (*logic*, *hooks*, *components*, *types*, *api*) dibungkus dalam folder fitur tersebut.

### Keuntungan Utama:
- **High Cohesion, Low Coupling**: Kode fitur terisolasi dengan rapi.
- **Easy Maintenance**: Jika ingin mengubah fitur artikel, Anda cukup fokus pada folder `src/features/articles/`.
- **Clean Separation of Concerns**: Logika bisnis dan panggilan API tidak dicampur dalam komponen UI.

---

## 3. Directory Structure Tree

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/                         # App initialization & Providers
│   │   ├── providers/               # TanStack Query Provider, Theme Provider
│   │   │   ├── QueryProvider.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── router/                  # React Router definitions & Guards
│   │   │   ├── AppRouter.tsx
│   │   │   └── AdminGuard.tsx
│   │   └── styles/                  # Global CSS & Tailwind directives
│   │       └── globals.css
│   │
│   ├── shared/                      # Global reusable elements (Cross-feature)
│   │   ├── components/
│   │   │   ├── ui/                  # Shadcn UI primitives (Button, Dialog, Input, etc.)
│   │   │   ├── layout/              # Navbar, Footer, AdminSidebar
│   │   │   └── common/              # SkeletonLoader, EmptyState, DynamicMeta
│   │   ├── lib/                     # Base Axios client & utilities
│   │   │   ├── axios.ts
│   │   │   └── utils.ts
│   │   ├── hooks/                   # Generic hooks (useDebounce, useMediaQuery)
│   │   └── types/                   # Base API response & Pagination interfaces
│   │
│   ├── features/                    # Feature-Driven Modules
│   │   ├── articles/                # Modul Fitur Artikel
│   │   │   ├── api/                 # Axios API request functions
│   │   │   │   └── article.api.ts
│   │   │   ├── components/          # UI spesifik artikel
│   │   │   │   ├── ArticleCard.tsx
│   │   │   │   ├── ArticleList.tsx
│   │   │   │   ├── ArticleFilter.tsx
│   │   │   │   ├── ArticleDetailView.tsx
│   │   │   │   └── ArticleFormEditor.tsx
│   │   │   ├── hooks/               # Custom hooks & TanStack Query hooks
│   │   │   │   ├── useArticles.ts
│   │   │   │   ├── useArticleDetail.ts
│   │   │   │   └── useArticleMutations.ts
│   │   │   ├── types/               # Type definitions & Zod schemas
│   │   │   │   └── article.types.ts
│   │   │   └── index.ts             # Public API exports untuk fitur artikel
│   │   │
│   │   ├── tags/                    # Modul Fitur Tag
│   │   │   └── ...
│   │   │
│   │   └── auth/                    # Modul Fitur Autentikasi Admin
│   │       ├── api/
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── store/               # Zustand store khusus Auth session
│   │       │   └── useAuthStore.ts
│   │       ├── types/
│   │       └── index.ts
│   │
│   ├── pages/                       # Page Entry Points (Connects Features to Routes)
│   │   ├── public/                  # Halaman Pembaca Publik
│   │   │   ├── HomePage.tsx
│   │   │   ├── ArticleDetailPage.tsx
│   │   │   └── SearchPage.tsx
│   │   └── admin/                   # Halaman Admin Portal (Tersembunyi)
│   │       ├── AdminLoginPage.tsx
│   │       ├── AdminDashboardPage.tsx
│   │       ├── AdminArticleListPage.tsx
│   │       └── AdminArticleEditorPage.tsx
│   │
│   ├── main.tsx
│   └── vite-env.d.ts
├── package.json
├── tailwind.config.js
├── vite.config.ts
└── vercel.json
```

---

## 4. Modular Separation Blueprint (Contoh Modul `articles`)

### A. Layer Types & Schema (`features/articles/types/article.types.ts`)
```typescript
import { z } from 'zod';

export const articleSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().min(20, "Konten minimal 20 karakter"),
  excerpt: z.string().optional(),
  coverImage: z.string().url("URL gambar tidak valid").optional().or(z.literal('')),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  tagIds: z.array(z.string()).default([]),
  ustadzId: z.string().optional(),
});

export type ArticleFormInput = z.infer<typeof articleSchema>;

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  category: { id: string; name: string; slug: string };
  tags: { id: string; name: string; slug: string }[];
  ustadz?: { id: string; name: string; slug: string };
}
```

### B. Layer API Calls (`features/articles/api/article.api.ts`)
```typescript
import { api } from '@/shared/lib/axios';
import { Article, ArticleFormInput } from '../types/article.types';

export const articleApi = {
  getArticles: async (params?: { search?: string; category?: string; tag?: string; page?: number }) => {
    const res = await api.get('/articles', { params });
    return res.data;
  },
  
  getArticleBySlug: async (slug: string): Promise<Article> => {
    const res = await api.get(`/articles/${slug}`);
    return res.data.data;
  },

  createArticle: async (data: ArticleFormInput): Promise<Article> => {
    const res = await api.post('/articles', data);
    return res.data.data;
  },
};
```

### C. Layer Custom Hooks / React Query (`features/articles/hooks/useArticles.ts`)
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleApi } from '../api/article.api';

export const useArticles = (params?: { search?: string; category?: string; tag?: string; page?: number }) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => articleApi.getArticles(params),
    staleTime: 1000 * 60 * 5, // 5 menit cache
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: articleApi.createArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};
```

### D. Layer Pure UI Component (`features/articles/components/ArticleCard.tsx`)
```tsx
import React from 'react';
import { Article } from '../types/article.types';
import { Clock } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onSelect?: (slug: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect?.(article.slug)}
      className="group cursor-pointer rounded-xl border border-slate-200 bg-white p-5 transition-all hover:shadow-md hover:border-emerald-500"
    >
      <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium mb-2">
        <span>{article.category.name}</span>
        {article.ustadz && <span>• Ust. {article.ustadz.name}</span>}
      </div>
      <h3 className="text-lg font-bold text-slate-800 group-hover:text-emerald-600 transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="mt-2 text-sm text-slate-600 line-clamp-3 leading-relaxed">
        {article.excerpt || article.content.substring(0, 120) + '...'}
      </p>
    </div>
  );
};
```

---

## 5. Security & Portal Admin Tersembunyi
- **Route Obfuscation**: Halaman login admin tidak diletakkan pada `/admin` atau `/login`, melainkan URL acak unik seperti `/gate-admin-secret-access/login`.
- **Protected Guard**: Route Guard (`AdminGuard`) membaca status autentikasi dari Zustand `useAuthStore` (token JWT di LocalStorage / Cookie).
- Jika pengguna non-admin mencoba mengakses rute `/admin/*` tanpa token valid, mereka akan secara otomatis di-redirect ke halaman **404 Not Found** (bukan ke halaman login), sehingga menyamarkan keberadaan portal admin.

---

## 6. Config Deployment Vercel (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```