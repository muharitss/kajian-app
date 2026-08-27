import React from 'react';
import { Link } from 'react-router-dom';
import type { Article } from '../types/article.types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye, User } from 'lucide-react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

interface ArticleCardProps {
  article: Article;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  // Estimate reading time based on word count (~200 words/min)
  const wordCount = article.content ? article.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = article.createdAt
    ? format(new Date(article.createdAt), 'dd MMMM yyyy', { locale: idLocale })
    : '';

  return (
    <Link to={`/article/${article.slug}`}>
      <Card className="h-full overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/50 group flex flex-col justify-between">
        <div>
          {article.coverImage && (
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src={article.coverImage}
                alt={article.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <CardHeader className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 pb-1.5 sm:pb-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {article.tags && article.tags.length > 0 ? (
                article.tags.map((t) => (
                  <Badge key={t.id} variant="secondary" className="font-normal text-[11px] sm:text-xs py-0.5 px-2">
                    #{t.name}
                  </Badge>
                ))
              ) : (
                <Badge variant="secondary" className="font-normal text-[11px] sm:text-xs py-0.5 px-2">
                  Kajian
                </Badge>
              )}
            </div>
            <CardTitle className="line-clamp-2 text-base sm:text-lg leading-snug group-hover:text-primary transition-colors">
              {article.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 sm:px-4 pb-2">
            <p className="line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {article.excerpt || article.content.substring(0, 110) + '...'}
            </p>
          </CardContent>
        </div>

        <CardFooter className="p-3 sm:px-4 sm:py-3 border-t text-[11px] sm:text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-1 truncate max-w-[55%]">
            <User className="h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" />
            <span className="truncate">{article.ustadz?.name || 'Redaksi Kajian'}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {readingTime}m
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              {article.viewCount}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
