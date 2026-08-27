import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminArticles } from '@/features/articles/hooks/useArticles';
import { useUstadz } from '@/features/ustadz/hooks/useUstadz';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Layers, UserCheck, Eye, Plus, ArrowRight } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { data: articlesData, isLoading: loadingArticles } = useAdminArticles({ limit: 100 });
  const { data: ustadzList = [] } = useUstadz();

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
    </div>
  );
};
