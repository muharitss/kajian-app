# [FE-04] UI: Filter Status DRAFT/PUBLISHED di Halaman Admin Artikel

**Labels**: `enhancement`, `frontend`, `admin`, `priority-medium`
**Assignees**: -
**Milestone**: Phase 2 — Admin Enhancement

---

## 🎯 Tujuan

Tambahkan filter dropdown status (Semua / PUBLISHED / DRAFT) di halaman `AdminArticleListPage.tsx` agar admin bisa dengan mudah melihat artikel berdasarkan status.

> ⚠️ **Prerequisite**: Issue **[BE-05]** (filter status di API) harus selesai dulu.

---

## 📍 Lokasi File yang Perlu Diubah

```
kajian/src/
├── pages/admin/
│   └── AdminArticleListPage.tsx     ← tambah state & UI filter status
└── features/articles/
    └── hooks/useArticles.ts          ← pastikan param status dikirim ke API
```

---

## ✅ Checklist Tugas

### Step 1: Tambah State Status Filter

Buka `AdminArticleListPage.tsx`. Di bagian `useState`, tambahkan:

```typescript
const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
```

### Step 2: Kirim Filter ke Hook

Ubah pemanggilan `useAdminArticles`:

```typescript
// Sebelum:
const { data: articlesData, isLoading, isError } = useAdminArticles({
  search: search || undefined,
  page,
  limit,
});

// Sesudah:
const { data: articlesData, isLoading, isError } = useAdminArticles({
  search: search || undefined,
  page,
  limit,
  status: statusFilter === 'ALL' ? undefined : statusFilter,
});
```

### Step 3: Update `useAdminArticles` Hook

Buka `src/features/articles/hooks/useArticles.ts`. Tambahkan `status` ke parameter:

```typescript
export const useAdminArticles = (params?: {
  search?: string;
  page?: number;
  limit?: number;
  status?: 'DRAFT' | 'PUBLISHED';  // ← tambahkan ini
}) => {
  return useQuery({
    queryKey: ['admin-articles', params],
    queryFn: () => articleApi.getAdminArticles(params),
  });
};
```

Pastikan `articleApi.getAdminArticles()` meneruskan semua params ke URL query string.

### Step 4: Tambah UI Filter Tab di Halaman

Di bagian "Filter / Search Bar" (sekitar baris 59-74), tambahkan tab filter status:

```tsx
{/* Filter / Search Bar */}
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-card p-3 rounded-lg border">
  {/* Search Input - sudah ada */}
  <div className="relative max-w-sm w-full">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <input
      type="text"
      placeholder="Cari berdasarkan judul..."
      value={search}
      onChange={handleSearchChange}
      className="w-full h-9 pl-9 pr-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
    />
  </div>

  {/* TAMBAHKAN: Filter Status */}
  <div className="flex items-center gap-1 border rounded-md p-0.5 bg-muted/30">
    {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((s) => (
      <button
        key={s}
        onClick={() => {
          setStatusFilter(s);
          setPage(1); // Reset ke halaman 1 saat filter berubah
        }}
        className={`h-7 px-3 rounded text-xs font-medium transition-colors ${
          statusFilter === s
            ? 'bg-background shadow-sm text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        {s === 'ALL' ? 'Semua' : s === 'PUBLISHED' ? '✓ Terbit' : '○ Draft'}
      </button>
    ))}
  </div>

  <span className="text-xs text-muted-foreground hidden sm:inline ml-auto">
    Total {totalItems} artikel
  </span>
</div>
```

### Step 5: Verifikasi Manual

- [ ] Login admin → buka `/admin/articles`
- [ ] Klik tab "DRAFT" → hanya artikel Draft yang tampil
- [ ] Klik tab "✓ Terbit" → hanya artikel Published yang tampil
- [ ] Klik tab "Semua" → semua artikel tampil kembali
- [ ] Kombinasi filter + search bekerja (contoh: Draft + cari "shalat")
- [ ] Pagination reset ke halaman 1 saat filter berubah
