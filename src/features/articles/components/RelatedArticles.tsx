import React from 'react';
import { useRelatedArticles } from '../hooks/useArticles';
import { ArticleCard } from './ArticleCard';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen } from 'lucide-react';

interface RelatedArticlesProps {
  currentSlug: string;
}

export const RelatedArticles: React.FC<RelatedArticlesProps> = ({ currentSlug }) => {
  const { data: articles, isLoading, isError } = useRelatedArticles(currentSlug);

  if (isError || (!isLoading && (!articles || articles.length === 0))) {
    return null;
  }

  return (
    <section className="border-t pt-8 mt-10 space-y-6">
      <div className="flex items-center gap-2">
        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Artikel Terkait
          </h3>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3 border rounded-xl p-4">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-5/6" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {articles?.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </section>
  );
};
