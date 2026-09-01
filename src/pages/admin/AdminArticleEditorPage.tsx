import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useArticleMutations } from '@/features/articles/hooks/useArticles';
import { useUstadz } from '@/features/ustadz/hooks/useUstadz';
import { useTags } from '@/features/tags/hooks/useTags';
import { useCategories } from '@/features/categories/hooks/useCategories';
import { articleApi } from '@/features/articles/api/article.api';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, AlertCircle, Upload, Loader2, X } from 'lucide-react';
import type { ArticleStatus } from '@/features/articles/types/article.types';

import { RichTextEditor } from '@/features/articles/components/RichTextEditor';

export const AdminArticleEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const { data: ustadzList = [] } = useUstadz();
  const { data: tags = [] } = useTags();
  const { data: categories = [] } = useCategories(true);
  const { createMutation, updateMutation } = useArticleMutations();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<ArticleStatus>('DRAFT');
  const [ustadzId, setUstadzId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  
  const [loadingArticle, setLoadingArticle] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setErrorMsg('');
    try {
      const url = await articleApi.uploadCoverImage(file);
      setCoverImage(url);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Gagal mengunggah gambar cover.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  // Fetch article detail if Editing
  useEffect(() => {
    if (isEdit && id) {
      setLoadingArticle(true);
      articleApi
        .getAdminArticles({ limit: 100 })
        .then((res) => {
          const article = res.data.find((a) => a.id === id);
          if (article) {
            setTitle(article.title);
            setContent(article.content);
            setExcerpt(article.excerpt || '');
            setCoverImage(article.coverImage || '');
            setStatus(article.status);
            setUstadzId(article.ustadz?.id || '');
            setCategoryId(article.category?.id || article.categoryId || '');
            setSelectedTagIds(article.tags?.map((t) => t.id) || []);
          }
        })
        .catch(() => {
          setErrorMsg('Gagal memuat detail artikel.');
        })
        .finally(() => setLoadingArticle(false));
    }
  }, [isEdit, id]);

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!title.trim() || !content.trim()) {
      setErrorMsg('Judul dan Konten artikel tidak boleh kosong.');
      return;
    }

    const payload = {
      title,
      content,
      excerpt: excerpt || undefined,
      coverImage: coverImage || undefined,
      status,
      ustadzId: ustadzId || undefined,
      categoryId: categoryId || undefined,
      tagIds: selectedTagIds,
    };

    if (isEdit && id) {
      updateMutation.mutate(
        { id, data: payload },
        {
          onSuccess: () => navigate('/admin/articles'),
          onError: (err: any) => setErrorMsg(err.response?.data?.message || 'Gagal menyimpan perubahan.'),
        }
      );
    } else {
      createMutation.mutate(payload, {
        onSuccess: () => navigate('/admin/articles'),
        onError: (err: any) => setErrorMsg(err.response?.data?.message || 'Gagal membuat artikel baru.'),
      });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link to="/admin/articles">
          <Button variant="ghost" size="sm" className="text-xs">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke Daftar Artikel
          </Button>
        </Link>
        <h1 className="text-lg font-bold">
          {isEdit ? 'Edit Artikel Kajian' : 'Buat Artikel Kajian Baru'}
        </h1>
      </div>

      {loadingArticle ? (
        <div className="p-8 text-center text-xs text-muted-foreground">Memuat data artikel...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="space-y-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Formulir Artikel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-md bg-destructive/15 text-destructive text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Title */}
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
              </div>

              {/* Grid Category, Ustadz & Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium">Kategori Utama</label>
                    <Link to="/admin/taxonomy" className="text-[11px] text-primary hover:underline" target="_blank" rel="noreferrer">
                      + Kelola Kategori
                    </Link>
                  </div>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Tanpa Kategori --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.parent ? `${c.parent.name} ↳ ${c.name}` : `📁 ${c.name}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Pemateri / Ustadz</label>
                  <select
                    value={ustadzId}
                    onChange={(e) => setUstadzId(e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Tanpa / Umum --</option>
                    {ustadzList.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Status Publikasi *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ArticleStatus)}
                    className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="DRAFT">DRAFT (Disimpan saja)</option>
                    <option value="PUBLISHED">PUBLISHED (Tampil publik)</option>
                  </select>
                </div>
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <label className="text-xs font-medium block">Cover Gambar (Opsional)</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/images/cover.jpg atau upload gambar dari komputer"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    className="flex-1 h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <label className="inline-flex cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-9 gap-1 text-xs cursor-pointer"
                      disabled={isUploading}
                      onClick={(e) => {
                        const fileInput = e.currentTarget.previousElementSibling as HTMLInputElement;
                        fileInput?.click();
                      }}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Mengunggah...
                        </>
                      ) : (
                        <>
                          <Upload className="h-3.5 w-3.5" />
                          Upload File
                        </>
                      )}
                    </Button>
                  </label>
                </div>

                {/* Cover Preview */}
                {coverImage && (
                  <div className="relative mt-2 rounded-lg border overflow-hidden bg-muted/30 max-w-xs group">
                    <img
                      src={coverImage}
                      alt="Pratinjau Cover"
                      className="w-full h-36 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => setCoverImage('')}
                      className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1 rounded-full text-xs shadow hover:opacity-90 transition"
                      title="Hapus Cover"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Excerpt */}
              <div className="space-y-1">
                <label className="text-xs font-medium">Ringkasan Singkat / Excerpt (Opsional)</label>
                <input
                  type="text"
                  placeholder="Ringkasan singkat 1-2 kalimat untuk pratinjau kartu"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Tag Selector */}
              {tags.length > 0 && (
                <div className="space-y-1">
                  <label className="text-xs font-medium block">Pilih Tag Terkait</label>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tags.map((t) => {
                      const isSelected = selectedTagIds.includes(t.id);
                      return (
                        <Badge
                          key={t.id}
                          variant={isSelected ? 'default' : 'outline'}
                          className="cursor-pointer text-xs"
                          onClick={() => toggleTag(t.id)}
                        >
                          #{t.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Content Body */}
              <div className="space-y-1">
                <label className="text-xs font-medium">Isi / Content Artikel Kajian *</label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Tuliskan isi artikel kajian secara lengkap..."
                  minHeight="350px"
                />
              </div>
            </CardContent>

            <CardFooter className="flex justify-end gap-2 pt-2">
              <Link to="/admin/articles">
                <Button variant="outline" size="sm" type="button">
                  Batal
                </Button>
              </Link>
              <Button size="sm" type="submit" disabled={isSaving}>
                <Save className="h-4 w-4 mr-1" />
                {isSaving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      )}
    </div>
  );
};
