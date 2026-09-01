# [FE-01] Rich Text Editor untuk Konten Artikel (Tiptap)

**Labels**: `feature`, `frontend`, `priority-critical`
**Assignees**: -
**Milestone**: Phase 1 — Foundation

---

## 🎯 Tujuan

Saat ini, konten artikel ditulis di plain `<textarea>` dan ditampilkan dengan `whitespace-pre-wrap`. Tidak ada formatting (bold, heading, list, dll). Tugas ini mengganti textarea dengan **rich text editor Tiptap** dan menampilkan konten HTML di halaman publik.

---

## 📍 Lokasi File yang Perlu Diubah

```
kajian/
├── package.json                                          ← install dependency baru
└── src/
    ├── pages/
    │   └── admin/
    │       └── AdminArticleEditorPage.tsx                ← ganti textarea jadi editor
    └── pages/
        └── public/
            └── ArticleDetailPage.tsx                     ← render HTML bukan plain text
```

---

## ✅ Checklist Tugas

### Step 1: Install Dependency

Jalankan di folder `kajian/`:

```bash
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image dompurify
npm install -D @types/dompurify
```

> `@tiptap/starter-kit` sudah include: Bold, Italic, Heading, BulletList, OrderedList, Blockquote, Code, dll.

### Step 2: Buat Komponen Editor

Buat file baru: `src/features/articles/components/RichTextEditor.tsx`

```tsx
// src/features/articles/components/RichTextEditor.tsx
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2, Quote, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RichTextEditorProps {
  value: string;           // HTML string
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Tuliskan isi artikel...',
  minHeight = '300px',
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none p-3 min-h-[300px] text-foreground',
        style: `min-height: ${minHeight}`,
      },
    },
  });

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`h-7 w-7 flex items-center justify-center rounded text-xs transition-colors
        ${active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        }`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-md border bg-background focus-within:ring-1 focus-within:ring-primary">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToolbarButton>
        <div className="h-4 w-px bg-border mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Numbered List"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Garis Pemisah"
        >
          <Minus className="h-3.5 w-3.5" />
        </ToolbarButton>
      </div>

      {/* Editor Area */}
      <EditorContent editor={editor} />
    </div>
  );
};
```

### Step 3: Ganti Textarea di Editor Page

Buka `src/pages/admin/AdminArticleEditorPage.tsx`.

Cari blok textarea konten (sekitar baris 318-329):
```tsx
{/* HAPUS/GANTI bagian ini: */}
<textarea
  rows={14}
  placeholder="Tuliskan isi artikel kajian secara lengkap..."
  value={content}
  onChange={(e) => setContent(e.target.value)}
  className="..."
  required
/>
```

Ganti dengan:
```tsx
{/* GANTI dengan ini: */}
import { RichTextEditor } from '@/features/articles/components/RichTextEditor';

// Di dalam JSX, ganti textarea dengan:
<RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Tuliskan isi artikel kajian secara lengkap..."
  minHeight="350px"
/>
```

Tambahkan import di bagian atas file:
```tsx
import { RichTextEditor } from '@/features/articles/components/RichTextEditor';
```

### Step 4: Render HTML di Halaman Detail Artikel

Buka `src/pages/public/ArticleDetailPage.tsx`.

Cari bagian render konten artikel (sekitar baris 158-161):
```tsx
{/* GANTI dari: */}
<div className="prose prose-slate max-w-none ... whitespace-pre-wrap ...">
  {article.content}
</div>
```

Ganti menjadi:
```tsx
{/* GANTI ke: */}
import DOMPurify from 'dompurify';

// Di dalam JSX:
<div
  className="prose prose-slate max-w-none text-foreground leading-relaxed text-sm sm:text-base md:text-lg py-2 sm:py-4"
  dangerouslySetInnerHTML={{
    __html: DOMPurify.sanitize(article.content),
  }}
/>
```

Import di bagian atas:
```tsx
import DOMPurify from 'dompurify';
```

### Step 5: Tambah CSS Prose Style

Buka `src/index.css` dan tambahkan styling untuk konten HTML:

```css
/* Prose styling untuk artikel */
.prose h2 { font-size: 1.25rem; font-weight: 700; margin: 1.5rem 0 0.75rem; }
.prose h3 { font-size: 1.1rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
.prose p { margin-bottom: 1rem; line-height: 1.75; }
.prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
.prose ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1rem; }
.prose li { margin-bottom: 0.25rem; }
.prose blockquote { border-left: 4px solid hsl(var(--primary)); padding-left: 1rem; font-style: italic; color: hsl(var(--muted-foreground)); margin: 1rem 0; }
.prose strong { font-weight: 700; }
.prose em { font-style: italic; }
.prose hr { border-color: hsl(var(--border)); margin: 2rem 0; }
```

### Step 6: Verifikasi Manual

- [ ] Buka `/gate-admin-x9/login` → login sebagai admin
- [ ] Buka artikel editor (buat baru atau edit yang ada)
- [ ] Coba tulis heading, bold, list di editor
- [ ] Simpan artikel
- [ ] Buka artikel di halaman publik → pastikan formatting tampil dengan benar
- [ ] Tidak ada XSS (script tag dibuang oleh DOMPurify)

---

## ⚠️ Catatan Penting

- **Artikel lama** yang berisi plain text akan tetap tampil normal (prose akan wrap-nya dengan baik)
- Pastikan `dompurify` diimport hanya di sisi browser (tidak SSR)
- Jangan lupa install package: `npm install @tiptap/react @tiptap/pm @tiptap/starter-kit dompurify @types/dompurify`
