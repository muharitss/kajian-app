import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminArticles, useArticleMutations } from '@/features/articles/hooks/useArticles';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Edit3, Trash2, Eye, Search, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export const AdminArticleListPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const { data: articlesData, isLoading, isError } = useAdminArticles({ search: search || undefined });
  const { deleteMutation } = useArticleMutations();

  const articles = articlesData?.data || [];

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus artikel "${title}"?`)) {
      deleteMutation.mutate(id);
    }
  };

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
      <div className="flex items-center justify-between gap-4 bg-card p-3 rounded-lg border">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <span className="text-xs text-muted-foreground hidden sm:inline">
          Total {articles.length} artikel
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
      </Card>
    </div>
  );
};
