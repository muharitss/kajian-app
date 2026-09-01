import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminArticles, useArticleMutations } from '@/features/articles/hooks/useArticles';
import type { ArticleStatus } from '@/features/articles/types/article.types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Edit3, Trash2, Eye, Search, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export const AdminArticleListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ArticleStatus>('ALL');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { data: articlesData, isLoading, isError } = useAdminArticles({
    search: search || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    page,
    limit,
  });

  const { deleteMutation } = useArticleMutations();

  const articles = articlesData?.data || [];
  const meta = articlesData?.meta;
  const totalPages = meta?.totalPages || 1;
  const totalItems = meta?.total || 0;

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const startItem = totalItems === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Artikel</h1>
          <p className="text-xs text-muted-foreground">Kelola seluruh artikel kajian (Terbit & Draft)</p>
        </div>
        <Link to="/admin/articles/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Tambah Artikel Baru
          </Button>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-card p-3 rounded-lg border">
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

        <div className="flex items-center gap-1 border rounded-md p-0.5 bg-muted/30">
          {(['ALL', 'PUBLISHED', 'DRAFT'] as const).map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
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

      {/* Articles Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-muted-foreground">Memuat data artikel...</div>
          ) : isError ? (
            <div className="p-8 text-center text-xs text-destructive flex items-center justify-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Gagal memuat artikel backend</span>
            </div>
          ) : articles.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Belum ada artikel. Klik "Tambah Artikel Baru" untuk membuat artikel pertama.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 border-b font-semibold text-muted-foreground">
                <tr>
                  <th className="p-3">Judul Artikel</th>
                  <th className="p-3">Kategori</th>
                  <th className="p-3">Tag</th>
                  <th className="p-3">Pemateri</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Dibaca</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-muted/20 transition-colors">
                    <td className="p-3 font-medium text-foreground max-w-xs truncate">
                      {article.title}
                    </td>
                    <td className="p-3">
                      {article.category ? (
                        <Badge variant="secondary" className="text-[10px] py-0 px-1 font-medium">
                          {article.category.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {article.tags?.map((t) => (
                          <Badge key={t.id} variant="outline" className="text-[10px] py-0 px-1">
                            #{t.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="p-3 text-muted-foreground">{article.ustadz?.name || '-'}</td>
                    <td className="p-3">
                      <Badge variant={article.status === 'PUBLISHED' ? 'default' : 'secondary'}>
                        {article.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{article.viewCount}</td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {article.createdAt
                        ? format(new Date(article.createdAt), 'dd MMM yyyy', { locale: idLocale })
                        : '-'}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap space-x-1">
                      {article.status === 'PUBLISHED' && (
                        <Link to={`/article/${article.slug}`} target="_blank">
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Prinjau Artikel">
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </Link>
                      )}
                      <Link to={`/admin/articles/edit/${article.id}`}>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Edit Artikel">
                          <Edit3 className="h-3.5 w-3.5 text-primary" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                        title="Hapus Artikel"
                        onClick={() => handleDelete(article.id, article.title)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>

        {/* Pagination Footer */}
        {!isLoading && !isError && totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>
                Menampilkan {startItem}-{endItem} dari {totalItems} artikel
              </span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="h-8 rounded border bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value={10}>10 per halaman</option>
                <option value={20}>20 per halaman</option>
                <option value={50}>50 per halaman</option>
              </select>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                className="h-8 text-xs"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </Button>

              <span className="px-2 font-medium text-foreground">
                Halaman {page} dari {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                className="h-8 text-xs"
              >
                Selanjutnya
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

