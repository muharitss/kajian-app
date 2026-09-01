# 📋 GitHub Issues — Frontend (kajian)

Daftar semua issue yang perlu dikerjakan untuk frontend. Diurutkan berdasarkan prioritas.

---

## 🗺️ Dependency Map

```
[FE-01] Rich Text Editor  ─── tidak ada prerequisite, mulai dulu ini
[FE-02] SEO Meta Tags     ─── tidak ada prerequisite, bisa paralel dengan FE-01
[FE-07] Auto Slug Preview ─── tidak ada prerequisite (quick win ~1 jam)

[BE-01] selesai ──► [FE-03] UI Edit Taxonomy
[BE-05] selesai ──► [FE-04] Filter Status Admin
[BE-03] selesai ──► [FE-06] Halaman Profil Ustadz

[FE-01] selesai ──► [FE-05] Dashboard Charts (recharts sudah install)
```

---

## 📌 Daftar Issue

| Issue | Judul | Prioritas | Fase | Prerequisite Backend |
|-------|-------|-----------|------|----------------------|
| [FE-01](./issue-01-rich-text-editor.md) | Rich Text Editor (Tiptap) | 🔴 Kritis | Phase 1 | ❌ Tidak ada |
| [FE-02](./issue-02-seo-meta-tags.md) | SEO Dynamic Meta Tags | 🔴 Kritis | Phase 1 | ❌ Tidak ada |
| [FE-07](./issue-07-auto-slug-preview.md) | Auto-Preview Slug di Editor | 🟢 Rendah | Phase 1 | ❌ Tidak ada |
| [FE-03](./issue-03-edit-taxonomy-ui.md) | UI Edit Kategori/Tag/Ustadz | 🔴 Tinggi | Phase 1 | ✅ [BE-01] |
| [FE-04](./issue-04-status-filter-admin.md) | Filter Status DRAFT/PUBLISHED | 🟡 Sedang | Phase 2 | ✅ [BE-05] |
| [FE-05](./issue-05-dashboard-analytics.md) | Dashboard Charts (Recharts) | 🟡 Sedang | Phase 3 | ❌ Tidak ada |
| [FE-06](./issue-06-ustadz-profile-page.md) | Halaman Profil Ustadz Publik | 🟡 Sedang | Phase 2 | ✅ [BE-03] |

---

## ⚙️ Cara Mulai Mengerjakan

1. Pastikan frontend berjalan: `npm run dev` di folder `kajian/`
2. Pastikan backend berjalan di `kajian-be/` di port 5000
3. Buat branch baru: `git checkout -b feat/fe-01-rich-text-editor`
4. Kerjakan sesuai checklist di file issue
5. Test manual sesuai petunjuk
6. Buat Pull Request ke branch `main`

## 🛠️ Tech Stack Frontend

- **Framework**: React 19 + Vite + TypeScript
- **Styling**: TailwindCSS v4 + Shadcn/UI
- **State Server**: TanStack Query v5 (`useQuery`, `useMutation`)
- **State Client**: Zustand v5
- **Routing**: React Router v7
- **HTTP**: Axios

## 📁 Struktur Folder Penting

```
kajian/src/
├── features/            ← Semua logika fitur (API, hooks, komponen spesifik)
│   ├── articles/
│   │   ├── api/         ← Fungsi axios API calls
│   │   ├── hooks/       ← useQuery / useMutation hooks
│   │   ├── components/  ← Komponen spesifik artikel
│   │   └── types/       ← TypeScript types
│   ├── categories/
│   ├── tags/
│   └── ustadz/
├── pages/
│   ├── public/          ← Halaman yang bisa diakses publik
│   └── admin/           ← Halaman admin (protected)
└── shared/
    ├── components/      ← Komponen reusable (Navbar, Footer, dll)
    ├── hooks/           ← Hooks generic (useDebounce, dll)
    └── lib/             ← axios instance, utility functions
```

## 🔑 Pola Kode yang Harus Diikuti

### Menambah API Call Baru
```typescript
// Di src/features/{feature}/api/{feature}.api.ts
export const featureApi = {
  getAll: () => api.get('/endpoint').then(r => r.data),
  getById: (id: string) => api.get(`/endpoint/${id}`).then(r => r.data),
  create: (data: object) => api.post('/endpoint', data).then(r => r.data),
  update: (id: string, data: object) => api.put(`/endpoint/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/endpoint/${id}`).then(r => r.data),
};
```

### Menambah Hook Baru
```typescript
// Di src/features/{feature}/hooks/use{Feature}.ts
export const useFeatureData = (params?: object) => {
  return useQuery({
    queryKey: ['feature-key', params],
    queryFn: () => featureApi.getAll(),
  });
};

export const useFeatureMutations = () => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: featureApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feature-key'] }),
  });
  return { createMutation };
};
```
