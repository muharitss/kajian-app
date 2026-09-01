export type ArticleStatus = 'DRAFT' | 'PUBLISHED';

export interface TagItem {
  id: string;
  name: string;
  slug: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  parent?: CategoryItem | null;
  children?: CategoryItem[];
}

export interface UstadzItem {
  id: string;
  name: string;
  slug: string;
  bio?: string;
  avatarUrl?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status: ArticleStatus;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  ustadz?: UstadzItem;
  categoryId?: string | null;
  category?: CategoryItem | null;
  tags: TagItem[];
}

export interface ArticleQueryParams {
  search?: string;
  category?: string;
  tag?: string;
  ustadz?: string;
  page?: number;
  limit?: number;
}

export interface CreateArticlePayload {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status?: ArticleStatus;
  ustadzId?: string;
  categoryId?: string;
  tagIds?: string[];
}

export interface UpdateArticlePayload {
  title?: string;
  content?: string;
  excerpt?: string;
  coverImage?: string;
  status?: ArticleStatus;
  ustadzId?: string | null;
  categoryId?: string | null;
  tagIds?: string[];
}
