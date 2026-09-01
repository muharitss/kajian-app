import React, { useState } from 'react';
import { useCategories, useCategoryMutations } from '@/features/categories/hooks/useCategories';
import { useTags, useTagMutations } from '@/features/tags/hooks/useTags';
import { useUstadz, useUstadzMutations } from '@/features/ustadz/hooks/useUstadz';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Tag as TagIcon, UserCheck, FolderTree, AlertCircle, Trash2 } from 'lucide-react';

export const AdminTaxonomyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'tags' | 'ustadz'>('categories');

  // Categories state
  const { data: categories = [], isLoading: loadingCat } = useCategories();
  const { data: categoriesFlat = [] } = useCategories(true);
  const { createMutation: createCat, deleteMutation: deleteCat } = useCategoryMutations();
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catParentId, setCatParentId] = useState('');
  const [catError, setCatError] = useState('');

  // Tags state
  const { data: tags = [], isLoading: loadingTag } = useTags();
  const { createMutation: createTag, deleteMutation: deleteTag } = useTagMutations();
  const [tagName, setTagName] = useState('');

  // Ustadz state
  const { data: ustadzList = [], isLoading: loadingUst } = useUstadz();
  const { createMutation: createUst, deleteMutation: deleteUst } = useUstadzMutations();
  const [ustName, setUstName] = useState('');
  const [ustBio, setUstBio] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCatError('');
    if (!catName.trim()) return;

    createCat.mutate(
      {
        name: catName.trim(),
        description: catDesc.trim() || undefined,
        parentId: catParentId || undefined,
      },
      {
        onSuccess: () => {
          setCatName('');
          setCatDesc('');
          setCatParentId('');
        },
        onError: (err: any) => {
          setCatError(err.response?.data?.message || 'Gagal menambahkan kategori');
        },
      }
    );
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tagName.trim()) return;
    createTag.mutate(tagName, {
      onSuccess: () => setTagName(''),
    });
  };

  const handleAddUstadz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ustName.trim()) return;
    createUst.mutate(
      { name: ustName, bio: ustBio || undefined },
      {
        onSuccess: () => {
          setUstName('');
          setUstBio('');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Taksonomi</h1>
        <p className="text-xs text-muted-foreground">Kelola master Kategori Artikel, Tag Populer, dan Pemateri Ustadz</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b pb-3">
        <Button
          variant={activeTab === 'categories' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('categories')}
        >
          <FolderTree className="h-4 w-4 mr-1.5" />
          Kategori Artikel ({categoriesFlat.length})
        </Button>

        <Button
          variant={activeTab === 'tags' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('tags')}
        >
          <TagIcon className="h-4 w-4 mr-1.5" />
          Tag ({tags.length})
        </Button>

        <Button
          variant={activeTab === 'ustadz' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('ustadz')}
        >
          <UserCheck className="h-4 w-4 mr-1.5" />
          Pemateri Ustadz ({ustadzList.length})
        </Button>
      </div>

      {/* Tab 1: Kategori */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Tambah Kategori Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCategory} className="space-y-3">
                {catError && (
                  <div className="p-2.5 rounded bg-destructive/15 text-destructive text-xs flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{catError}</span>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-xs font-medium">Nama Kategori *</label>
                  <input
                    type="text"
                    placeholder="Misal: Aqidah, Fiqih, Al-Qur'an"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Kategori Induk (Parent)</label>
                  <select
                    value={catParentId}
                    onChange={(e) => setCatParentId(e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">-- Tanpa Induk (Kategori Utama) --</option>
                    {categories.map((parent) => (
                      <option key={parent.id} value={parent.id}>
                        {parent.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted-foreground">Pilih jika kategori ini adalah subkategori.</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium">Deskripsi Singkat (Opsional)</label>
                  <input
                    type="text"
                    placeholder="Kajian seputar ilmu..."
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <Button size="sm" type="submit" className="w-full" disabled={createCat.isPending}>
                  <Plus className="h-4 w-4 mr-1" />
                  {createCat.isPending ? 'Menyimpan...' : 'Tambah Kategori'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Daftar Kategori Terdaftar</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingCat ? (
                <div className="text-xs text-muted-foreground">Memuat data...</div>
              ) : categories.length === 0 ? (
                <div className="text-xs text-muted-foreground">Belum ada kategori.</div>
              ) : (
                <div className="space-y-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="p-3 rounded-lg border bg-card text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-foreground">{cat.name}</span>
                            <Badge variant="outline" className="text-[10px]">Utama</Badge>
                          </div>
                          {cat.description && (
                            <p className="text-muted-foreground text-[11px] mt-0.5">{cat.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteCat.mutate(cat.id)}
                          title="Hapus Kategori"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* Subcategories / Children */}
                      {cat.children && cat.children.length > 0 && (
                        <div className="pl-4 border-l-2 border-muted space-y-1.5 pt-1">
                          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Subkategori:</p>
                          {cat.children.map((child) => (
                            <div
                              key={child.id}
                              className="flex items-center justify-between p-2 rounded bg-muted/40 text-xs"
                            >
                              <div>
                                <span className="font-medium text-foreground">↳ {child.name}</span>
                                {child.description && (
                                  <p className="text-muted-foreground text-[11px]">{child.description}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                                onClick={() => deleteCat.mutate(child.id)}
                                title="Hapus Subkategori"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 2: Tags */}
      {activeTab === 'tags' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Tambah Tag Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddTag} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Nama Tag *</label>
                  <input
                    type="text"
                    placeholder="Misal: Sholat, Puasa, Tauhid"
                    value={tagName}
                    onChange={(e) => setTagName(e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <Button size="sm" type="submit" className="w-full" disabled={createTag.isPending}>
                  <Plus className="h-4 w-4 mr-1" />
                  Tambah Tag
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Daftar Tag Terdaftar</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingTag ? (
                <div className="text-xs text-muted-foreground">Memuat data...</div>
              ) : tags.length === 0 ? (
                <div className="text-xs text-muted-foreground">Belum ada tag.</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <Badge key={t.id} variant="secondary" className="px-3 py-1.5 text-xs flex items-center gap-2">
                      <span>#{t.name}</span>
                      <button
                        onClick={() => deleteTag.mutate(t.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab 3: Ustadz */}
      {activeTab === 'ustadz' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Tambah Ustadz Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUstadz} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Nama Lengkap Ustadz *</label>
                  <input
                    type="text"
                    placeholder="Ust. Abdullah Zaen, Lc., M.A."
                    value={ustName}
                    onChange={(e) => setUstName(e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Bio Singkat</label>
                  <input
                    type="text"
                    placeholder="Da'i dan pengasuh pesantren..."
                    value={ustBio}
                    onChange={(e) => setUstBio(e.target.value)}
                    className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <Button size="sm" type="submit" className="w-full" disabled={createUst.isPending}>
                  <Plus className="h-4 w-4 mr-1" />
                  Simpan Data Ustadz
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-sm font-semibold">Daftar Pemateri Terdaftar</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingUst ? (
                <div className="text-xs text-muted-foreground">Memuat data...</div>
              ) : ustadzList.length === 0 ? (
                <div className="text-xs text-muted-foreground">Belum ada pemateri.</div>
              ) : (
                <div className="space-y-2">
                  {ustadzList.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center justify-between p-3 rounded-md border bg-card text-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{u.name}</p>
                        <p className="text-muted-foreground text-[11px]">{u.bio || `slug: ${u.slug}`}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                        onClick={() => deleteUst.mutate(u.id)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

