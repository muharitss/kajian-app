import React, { useState } from 'react';
import { useCategories, useCategoryMutations } from '@/features/categories/hooks/useCategories';
import { useTags, useTagMutations } from '@/features/tags/hooks/useTags';
import { useUstadz, useUstadzMutations } from '@/features/ustadz/hooks/useUstadz';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Tag as TagIcon, UserCheck, FolderTree, AlertCircle, Trash2, Pencil, X } from 'lucide-react';

export const AdminTaxonomyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'categories' | 'tags' | 'ustadz'>('categories');

  // Categories state
  const { data: categories = [], isLoading: loadingCat } = useCategories();
  const { data: categoriesFlat = [] } = useCategories(true);
  const { createMutation: createCat, deleteMutation: deleteCat, updateMutation: updateCat } = useCategoryMutations();
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catParentId, setCatParentId] = useState('');
  const [catError, setCatError] = useState('');
  const [editingCat, setEditingCat] = useState<{ id: string; name: string; description: string; parentId: string } | null>(null);

  // Tags state
  const { data: tags = [], isLoading: loadingTag } = useTags();
  const { createMutation: createTag, deleteMutation: deleteTag, updateMutation: updateTag } = useTagMutations();
  const [tagName, setTagName] = useState('');
  const [editingTag, setEditingTag] = useState<{ id: string; name: string } | null>(null);

  // Ustadz state
  const { data: ustadzList = [], isLoading: loadingUst } = useUstadz();
  const { createMutation: createUst, deleteMutation: deleteUst, updateMutation: updateUst } = useUstadzMutations();
  const [ustName, setUstName] = useState('');
  const [ustBio, setUstBio] = useState('');
  const [editingUst, setEditingUst] = useState<{ id: string; name: string; bio: string } | null>(null);

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

  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat || !editingCat.name.trim()) return;

    updateCat.mutate(
      {
        id: editingCat.id,
        data: {
          name: editingCat.name.trim(),
          description: editingCat.description.trim() || undefined,
          parentId: editingCat.parentId || undefined,
        },
      },
      {
        onSuccess: () => setEditingCat(null),
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

  const handleUpdateTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTag || !editingTag.name.trim()) return;
    updateTag.mutate(
      { id: editingTag.id, name: editingTag.name.trim() },
      { onSuccess: () => setEditingTag(null) }
    );
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

  const handleUpdateUstadz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUst || !editingUst.name.trim()) return;
    updateUst.mutate(
      {
        id: editingUst.id,
        data: { name: editingUst.name.trim(), bio: editingUst.bio.trim() || undefined },
      },
      { onSuccess: () => setEditingUst(null) }
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
          {editingCat ? (
            <Card className="md:col-span-1 h-fit border-primary/50 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-primary">Edit Kategori</CardTitle>
                <button onClick={() => setEditingCat(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateCategory} className="space-y-3">
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
                    <label className="text-xs font-medium">Kategori Induk (Parent)</label>
                    <select
                      value={editingCat.parentId}
                      onChange={(e) => setEditingCat({ ...editingCat, parentId: e.target.value })}
                      className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      <option value="">-- Tanpa Induk (Kategori Utama) --</option>
                      {categories
                        .filter((parent) => parent.id !== editingCat.id)
                        .map((parent) => (
                          <option key={parent.id} value={parent.id}>
                            {parent.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium">Deskripsi Singkat</label>
                    <input
                      type="text"
                      value={editingCat.description}
                      onChange={(e) => setEditingCat({ ...editingCat, description: e.target.value })}
                      className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" type="submit" className="flex-1" disabled={updateCat.isPending}>
                      {updateCat.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                    <Button size="sm" type="button" variant="outline" onClick={() => setEditingCat(null)}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
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
          )}

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
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0 text-primary hover:bg-primary/10"
                            onClick={() =>
                              setEditingCat({
                                id: cat.id,
                                name: cat.name,
                                description: cat.description || '',
                                parentId: cat.parentId || '',
                              })
                            }
                            title="Edit Kategori"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
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
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-primary hover:bg-primary/10"
                                  onClick={() =>
                                    setEditingCat({
                                      id: child.id,
                                      name: child.name,
                                      description: child.description || '',
                                      parentId: cat.id,
                                    })
                                  }
                                  title="Edit Subkategori"
                                >
                                  <Pencil className="h-3 w-3" />
                                </Button>
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
          {editingTag ? (
            <Card className="md:col-span-1 h-fit border-primary/50 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-primary">Edit Tag</CardTitle>
                <button onClick={() => setEditingTag(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateTag} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Nama Tag *</label>
                    <input
                      type="text"
                      value={editingTag.name}
                      onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                      className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" type="submit" className="flex-1" disabled={updateTag.isPending}>
                      {updateTag.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                    <Button size="sm" type="button" variant="outline" onClick={() => setEditingTag(null)}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
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
          )}

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
                    <Badge key={t.id} variant="secondary" className="px-3 py-1.5 text-xs flex items-center gap-1.5">
                      <span>#{t.name}</span>
                      <button
                        onClick={() => setEditingTag({ id: t.id, name: t.name })}
                        className="text-muted-foreground hover:text-primary transition-colors ml-1"
                        title="Edit Tag"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => deleteTag.mutate(t.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                        title="Hapus Tag"
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
          {editingUst ? (
            <Card className="md:col-span-1 h-fit border-primary/50 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-semibold text-primary">Edit Ustadz</CardTitle>
                <button onClick={() => setEditingUst(null)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateUstadz} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Nama Lengkap Ustadz *</label>
                    <input
                      type="text"
                      value={editingUst.name}
                      onChange={(e) => setEditingUst({ ...editingUst, name: e.target.value })}
                      className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium">Bio Singkat</label>
                    <input
                      type="text"
                      value={editingUst.bio}
                      onChange={(e) => setEditingUst({ ...editingUst, bio: e.target.value })}
                      className="w-full h-9 px-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" type="submit" className="flex-1" disabled={updateUst.isPending}>
                      {updateUst.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </Button>
                    <Button size="sm" type="button" variant="outline" onClick={() => setEditingUst(null)}>
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          ) : (
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
          )}

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
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-primary hover:bg-primary/10"
                          onClick={() => setEditingUst({ id: u.id, name: u.name, bio: u.bio || '' })}
                          title="Edit Ustadz"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                          onClick={() => deleteUst.mutate(u.id)}
                          title="Hapus Ustadz"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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
