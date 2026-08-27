import React, { useState } from 'react';
import { useTags, useTagMutations } from '@/features/tags/hooks/useTags';
import { useUstadz, useUstadzMutations } from '@/features/ustadz/hooks/useUstadz';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Tag as TagIcon, UserCheck } from 'lucide-react';

export const AdminTaxonomyPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tags' | 'ustadz'>('tags');

  // Tags state
  const { data: tags = [], isLoading: loadingTag } = useTags();
  const { createMutation: createTag, deleteMutation: deleteTag } = useTagMutations();
  const [tagName, setTagName] = useState('');

  // Ustadz state
  const { data: ustadzList = [], isLoading: loadingUst } = useUstadz();
  const { createMutation: createUst, deleteMutation: deleteUst } = useUstadzMutations();
  const [ustName, setUstName] = useState('');
  const [ustBio, setUstBio] = useState('');

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
        <p className="text-xs text-muted-foreground">Kelola master data Tag Populer dan Pemateri Ustadz</p>
      </div>

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b pb-3">
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

      {/* Tab 1: Tags */}
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

      {/* Tab 2: Ustadz */}
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
