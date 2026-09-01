# [FE-07] Quick Win: Auto-Preview Slug di Admin Article Editor

**Labels**: `enhancement`, `frontend`, `admin`, `quick-win`, `priority-low`
**Assignees**: -
**Milestone**: Phase 1 — Foundation (Quick Win)

---

## 🎯 Tujuan

Saat admin mengetik judul artikel, tampilkan preview slug yang akan dihasilkan secara real-time di bawah input judul. Ini membantu admin memahami URL artikel sebelum disimpan.

**Estimasi waktu pengerjaan: ~1 jam**

---

## 📍 Lokasi File yang Perlu Diubah

```
kajian/src/pages/admin/AdminArticleEditorPage.tsx   ← satu-satunya file yang diubah
```

---

## ✅ Checklist Tugas

### Step 1: Buat Fungsi `toSlug`

Di bagian atas file `AdminArticleEditorPage.tsx`, setelah semua import, tambahkan fungsi helper:

```typescript
// Helper: Convert judul menjadi slug preview
// Catatan: Slug final di-generate oleh backend, ini hanya preview
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')   // hapus karakter selain huruf, angka, spasi, strip
    .trim()
    .replace(/\s+/g, '-')           // spasi jadi strip
    .replace(/-+/g, '-');           // strip dobel jadi satu
}
```

### Step 2: Tampilkan Preview Slug di Bawah Input Judul

Cari bagian input Judul Artikel (sekitar baris 154-165):

```tsx
{/* Sebelum (hanya input): */}
<div className="space-y-1">
  <label className="text-xs font-medium">Judul Artikel *</label>
  <input
    type="text"
    ...
  />
</div>
```

Ubah menjadi:
```tsx
{/* Sesudah (input + preview slug): */}
<div className="space-y-1">
  <label className="text-xs font-medium">Judul Artikel *</label>
  <input
    type="text"
    placeholder="Misal: Penjelasan Pembatal Keislaman bagian 1"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
    required
  />
  {/* TAMBAHKAN: Preview slug */}
  {title && (
    <p className="text-[11px] text-muted-foreground flex items-center gap-1 pt-0.5">
      <span className="font-medium">URL Preview:</span>
      <code className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-mono">
        /article/<span className="text-primary">{toSlug(title)}</span>
      </code>
      <span className="text-[10px] italic">(slug final dibuat otomatis oleh server)</span>
    </p>
  )}
</div>
```

### Step 3: Verifikasi Manual

- [ ] Buka `/admin/articles/new`
- [ ] Ketik judul: "Pengertian Thaharah dalam Islam" 
- [ ] Preview slug muncul: `/article/pengertian-thaharah-dalam-islam`
- [ ] Karakter khusus (apostrof, tanda tanya, dll) otomatis dihilangkan
- [ ] Saat judul kosong → preview tidak muncul
- [ ] Saat mode edit artikel lama → preview tetap muncul berdasarkan judul saat ini

---

## 📝 Catatan

- Slug yang ditampilkan adalah **preview**, bukan slug final
- Slug final tetap dibuat oleh backend menggunakan `slugify`
- Jika judul sudah ada yang mirip, backend akan tambahkan suffix angka otomatis
- Ini murni fitur UX, tidak ada perubahan logic di backend
