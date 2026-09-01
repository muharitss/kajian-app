# [FE-05] Dashboard: Tambah Charts Statistik dengan Recharts

**Labels**: `enhancement`, `frontend`, `admin`, `priority-medium`
**Assignees**: -
**Milestone**: Phase 3 — Analytics

---

## 🎯 Tujuan

Lengkapi halaman `AdminDashboardPage.tsx` dengan:
1. Chart Top 5 artikel berdasarkan view count
2. Isi card "Daftar Kategori" yang masih kosong
3. Daftar artikel terbaru dengan quick link

> 📦 **Recharts sudah terinstall!** Cek `package.json` — `recharts` sudah ada, langsung bisa dipakai.

---

## 📍 Lokasi File yang Perlu Diubah

```
kajian/src/
└── pages/admin/
    └── AdminDashboardPage.tsx     ← file utama yang diubah
```

---

## ✅ Checklist Tugas

### Step 1: Tambah Import yang Diperlukan

Di bagian import `AdminDashboardPage.tsx`, tambahkan:

```typescript
// Import Recharts (sudah terinstall)
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

// Import hook kategori
import { useCategories } from '@/features/categories/hooks/useCategories';
```

### Step 2: Tambah Data Kategori

Di dalam komponen, setelah `const { data: ustadzList = [] }`:

```typescript
const { data: categoriesFlat = [] } = useCategories(true); // flat list
```

### Step 3: Isi Card "Daftar Kategori" yang Masih Kosong

Cari Card "Daftar Kategori" (sekitar baris 60-65) — saat ini `<CardContent>` kosong. Isi dengan:

```tsx
<Card>
  <CardHeader className="flex flex-row items-center justify-between pb-2">
    <CardTitle className="text-xs font-medium text-muted-foreground">Daftar Kategori</CardTitle>
    <Layers className="h-4 w-4 text-primary" />
  </CardHeader>
  <CardContent>
    <div className="text-2xl font-bold">{categoriesFlat.length}</div>
    <p className="text-xs text-muted-foreground mt-1">Kategori & subkategori</p>
  </CardContent>
</Card>
```

### Step 4: Tambah Chart Top Artikel

Di bawah "Quick Action Links" section (setelah baris 108), tambahkan section baru:

```tsx
{/* ======================================================== */}
{/* Top 5 Artikel by View Count - Bar Chart                  */}
{/* ======================================================== */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Chart: Top Artikel */}
  <Card className="p-4 sm:p-6">
    <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
      <Eye className="h-4 w-4 text-primary" />
      Top 5 Artikel Paling Banyak Dibaca
    </h3>
    {loadingArticles ? (
      <div className="h-48 flex items-center justify-center text-xs text-muted-foreground">
        Memuat data...
      </div>
    ) : (
      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={articles
            .filter((a) => a.status === 'PUBLISHED')
            .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
            .slice(0, 5)
            .map((a) => ({
              name: a.title.length > 20 ? a.title.substring(0, 20) + '…' : a.title,
              views: a.viewCount || 0,
            }))}
          layout="vertical"
          margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
        >
          <XAxis type="number" tick={{ fontSize: 10 }} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={120} />
          <Tooltip
            formatter={(value) => [`${value} views`, 'Dibaca']}
            contentStyle={{ fontSize: '11px' }}
          />
          <Bar dataKey="views" radius={[0, 4, 4, 0]}>
            {articles.slice(0, 5).map((_, i) => (
              <Cell
                key={i}
                fill={i === 0 ? 'hsl(var(--primary))' : `hsl(var(--primary) / ${0.8 - i * 0.15})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    )}
  </Card>

  {/* List: Artikel Terbaru */}
  <Card className="p-4 sm:p-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-bold text-sm">Artikel Terbaru</h3>
      <Link to="/admin/articles">
        <Button variant="ghost" size="sm" className="text-xs">
          Lihat Semua <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </Link>
    </div>
    <div className="space-y-2">
      {loadingArticles ? (
        <div className="text-xs text-muted-foreground">Memuat...</div>
      ) : (
        articles
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map((article) => (
            <div key={article.id} className="flex items-center justify-between gap-2 py-1.5 border-b last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{article.title}</p>
                <p className="text-[10px] text-muted-foreground">
                  {article.status === 'PUBLISHED' ? '✓ Terbit' : '○ Draft'} · {article.viewCount || 0} views
                </p>
              </div>
              <Link to={`/admin/articles/edit/${article.id}`}>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 flex-shrink-0">
                  <Edit3 className="h-3 w-3 text-muted-foreground" />
                </Button>
              </Link>
            </div>
          ))
      )}
    </div>
  </Card>
</div>
```

Tambahkan import `Edit3` jika belum ada:
```typescript
import { FileText, Layers, UserCheck, Eye, Plus, ArrowRight, Edit3 } from 'lucide-react';
```

### Step 5: Verifikasi Manual

- [ ] Login admin → buka `/admin`
- [ ] Card "Daftar Kategori" menampilkan angka jumlah kategori
- [ ] Chart Bar muncul dengan data 5 artikel paling banyak dibaca
- [ ] Daftar "Artikel Terbaru" menampilkan 5 artikel terbaru dengan status
- [ ] Klik tombol edit di daftar artikel terbaru → redirect ke editor artikel
- [ ] Tampilan mobile responsif
