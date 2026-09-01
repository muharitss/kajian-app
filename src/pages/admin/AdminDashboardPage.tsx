import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useAdminArticles } from '@/features/articles/hooks/useArticles';
import { useUstadz } from '@/features/ustadz/hooks/useUstadz';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Layers, UserCheck, Eye, Plus, ArrowRight, Edit3 } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { data: articlesData, isLoading: loadingArticles } = useAdminArticles({ limit: 100 });
  const { data: ustadzList = [] } = useUstadz();
  const { data: categoriesFlat = [] } = useCategories(true);

  const articles = articlesData?.data || [];
  const publishedCount = articles.filter((a) => a.status === 'PUBLISHED').length;
  const draftCount = articles.filter((a) => a.status === 'DRAFT').length;
  const totalViews = articles.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-muted-foreground">Ringkasan aktivitas dan statistik Portal Kajian</p>
        </div>
        <Link to="/admin/articles/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Tulis Artikel Baru
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Artikel</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingArticles ? '...' : articles.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedCount} Terbit · {draftCount} Draft
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total Pembaca (Views)</CardTitle>
            <Eye className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingArticles ? '...' : totalViews}</div>
            <p className="text-xs text-muted-foreground mt-1">Akumulasi seluruh artikel</p>
          </CardContent>
        </Card>

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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Daftar Ustadz</CardTitle>
            <UserCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ustadzList.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pemateri terdaftar</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Manajemen Artikel</h3>
            <Link to="/admin/articles">
              <Button variant="ghost" size="sm" className="text-xs">
                Lihat Semua <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Kelola daftar artikel kajian, ubah status Publikasi/Draft, atau lakukan pengeditan konten.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">Kelola Taksonomi</h3>
            <Link to="/admin/taxonomy">
              <Button variant="ghost" size="sm" className="text-xs">
                Kelola Taksonomi <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Tambah dan edit master data Kategori, Tag Populer, serta profil Pemateri/Ustadz.
          </p>
        </Card>
      </div>

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
    </div>
  );
};

