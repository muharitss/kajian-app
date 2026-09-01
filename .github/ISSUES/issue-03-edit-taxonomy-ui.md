# [FE-03] UI: Edit Kategori, Tag, dan Ustadz di Halaman Admin Taxonomy

**Labels**: `feature`, `frontend`, `admin`, `priority-high`
**Assignees**: -
**Milestone**: Phase 1 — Foundation

---

## 🎯 Tujuan

Halaman `AdminTaxonomyPage.tsx` saat ini hanya bisa **tambah** dan **hapus**. Tambahkan fungsi **edit** untuk:
- Kategori (ubah nama, deskripsi, parent)
- Tag (ubah nama)
- Ustadz (ubah nama, bio)

> ⚠️ **Prerequisite**: Issue **[BE-01]** (endpoint PUT /categories/:id) harus selesai dulu.

---

## 📍 Lokasi File yang Perlu Diubah

```
kajian/src/
├── pages/admin/
│   └── AdminTaxonomyPage.tsx      ← file utama yang diubah
└── features/
    ├── categories/hooks/
    │   └── useCategories.ts        ← pastikan useCategoryMutations punya updateMutation
    ├── tags/hooks/
    │   └── useTags.ts              ← pastikan useTagMutations punya updateMutation
    └── ustadz/hooks/
        └── useUstadz.ts            ← pastikan useUstadzMutations punya updateMutation
```

---

## ✅ Checklist Tugas

### Step 1: Tambah `updateMutation` ke Hooks

**`src/features/categories/hooks/useCategories.ts`**

Cari `useCategoryMutations`. Pastikan ada `updateMutation`:
```typescript
export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  // Sudah ada:
  const createMutation = useMutation({ ... });
  const deleteMutation = useMutation({ ... });

  // TAMBAHKAN:
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name?: string; description?: string; parentId?: string | null } }) =>
      categoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  return { createMutation, deleteMutation, updateMutation };
};
```

Pastikan juga ada `categoryApi.update()` di file API:
```typescript
// src/features/categories/api/category.api.ts
update: (id: string, data: object) => api.put(`/categories/${id}`, data).then(r => r.data),
```

Lakukan hal yang sama untuk **Tags** dan **Ustadz**.

### Step 2: Tambah State Edit di `AdminTaxonomyPage.tsx`

Di bagian `// Categories state`, tambahkan:
```typescript
// State untuk mode edit kategori
const [editingCat, setEditingCat] = useState<{ id: string; name: string; description: string; parentId: string } | null>(null);
const { updateMutation: updateCat } = useCategoryMutations();
```

Untuk tags:
```typescript
const [editingTag, setEditingTag] = useState<{ id: string; name: string } | null>(null);
const { updateMutation: updateTag } = useTagMutations();
```

Untuk ustadz:
```typescript
const [editingUst, setEditingUst] = useState<{ id: string; name: string; bio: string } | null>(null);
const { updateMutation: updateUstadz } = useUstadzMutations();
```

### Step 3: Tambah Tombol Edit & Form Edit di Daftar Kategori

Di dalam loop `categories.map((cat) => ...)` sekitar baris 190, tambahkan tombol edit:

```tsx
// Di sebelah tombol Trash2 (hapus), tambahkan tombol Edit:
<Button
  variant="ghost"
  size="sm"
  className="h-7 w-7 p-0 text-primary hover:bg-primary/10"
  onClick={() => setEditingCat({ id: cat.id, name: cat.name, description: cat.description || '', parentId: cat.parentId || '' })}
  title="Edit Kategori"
>
  <Pencil className="h-3.5 w-3.5" />
</Button>
```

Tambahkan import `Pencil` dari lucide-react di bagian atas:
```tsx
import { Plus, Tag as TagIcon, UserCheck, FolderTree, AlertCircle, Trash2, Pencil, X } from 'lucide-react';
```

### Step 4: Tambah Inline Edit Form

Di dalam tab kategori (setelah form "Tambah Kategori Baru"), tambahkan form edit yang muncul saat `editingCat` tidak null:

```tsx
{/* Form Edit Kategori — muncul saat mode edit aktif */}
{editingCat && (
  <Card className="border-primary/50 bg-primary/5">
    <CardHeader>
      <CardTitle className="text-sm font-semibold text-primary flex items-center justify-between">
        Edit Kategori
        <button onClick={() => setEditingCat(null)} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </CardTitle>
    </CardHeader>
    <CardContent>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          updateCat.mutate(
            {
              id: editingCat.id,
              data: { name: editingCat.name, description: editingCat.description, parentId: editingCat.parentId || undefined },
            },
            { onSuccess: () => setEditingCat(null) }
          );
        }}
        className="space-y-3"
      >
        <div className="space-y-1">
          <label className="text-xs font-medium">Nama Kategori *</label>
          <input
            type="text"
            value={editingCat.name}
            onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
            className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium">Deskripsi</label>
          <input
            type="text"
            value={editingCat.description}
            onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
            className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          <Button size="sm" type="submit" disabled={updateCat.isPending}>
            {updateCat.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
          <Button size="sm" type="button" variant="outline" onClick={() => setEditingCat(null)}>
            Batal
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
)}
```

### Step 5: Lakukan Hal yang Sama untuk Tag dan Ustadz

Pola yang sama berlaku:
- [ ] Tag: Tombol edit → form inline dengan input nama tag
- [ ] Ustadz: Tombol edit → form inline dengan input nama dan bio

### Step 6: Verifikasi Manual

- [ ] Login sebagai admin → buka `/admin/taxonomy`
- [ ] Klik tombol edit pada sebuah kategori
- [ ] Form edit muncul dengan data yang sudah terisi
- [ ] Ubah nama → klik "Simpan Perubahan"
- [ ] Kategori berhasil terupdate di daftar
- [ ] Klik Batal → form tertutup tanpa perubahan
- [ ] Hal yang sama berlaku untuk Tag dan Ustadz
