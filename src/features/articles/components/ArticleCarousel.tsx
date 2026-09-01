import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import useEmblaCarousel from 'embla-carousel-react';
import type { Article } from '../types/article.types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ArticleCarouselProps {
  articles: Article[];
}

interface ArticleGridCardProps {
  article: Article;
  isFeatured?: boolean;
}

const ArticleGridCard: React.FC<ArticleGridCardProps> = ({ article, isFeatured = false }) => {
  const categoryName = article.tags?.[0]?.name || 'Kajian Utama';
  const formattedDate = article.createdAt
    ? format(new Date(article.createdAt), 'dd MMMM yyyy', { locale: idLocale })
    : '';
  const plainExcerpt =
    article.excerpt || article.content.replace(/<[^>]*>/g, '').substring(0, 110) + '...';

  return (
    <Link
      to={`/article/${article.slug}`}
      className="group/card relative block w-full h-full overflow-hidden cursor-pointer bg-slate-900 border-none select-none"
    >
      {/* Background Cover Image with Zoom effect */}
      {article.coverImage ? (
        <img
          src={article.coverImage}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-105"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : null}

      {/* Fallback solid/gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900" />

      {/* Dark Overlay Gradient (Bottom to Top) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300" />

      {/* Category Badge at top left */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
        <Badge
          className={cn(
            'bg-emerald-600 hover:bg-emerald-700 text-white border-none font-semibold uppercase tracking-wider shadow-md',
            isFeatured
              ? 'text-[10px] sm:text-xs px-2.5 py-0.5'
              : 'text-[9px] sm:text-[10px] px-2 py-0'
          )}
        >
          {categoryName}
        </Badge>
      </div>

      {/* Bottom Content Area */}
      <div
        className={cn(
          'absolute bottom-0 left-0 right-0 z-10 flex flex-col justify-end text-white transition-transform duration-300 ease-out',
          isFeatured ? 'p-3.5 sm:p-5' : 'p-2.5 sm:p-3.5'
        )}
      >
        {/* Publication Date */}
        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-white/80 font-medium mb-1">
          <Calendar className="h-3 w-3 flex-shrink-0" />
          <span>{formattedDate}</span>
        </div>

        {/* Article Title */}
        <h2
          className={cn(
            'font-extrabold text-white leading-snug drop-shadow-sm transition-all duration-300 group-hover/card:-translate-y-0.5 line-clamp-2',
            isFeatured
              ? 'text-sm sm:text-xl md:text-2xl'
              : 'text-xs sm:text-sm md:text-base'
          )}
        >
          {article.title}
        </h2>

        {/* Article Description (Reveals & slides up on hover) */}
        <div className="max-h-0 opacity-0 group-hover/card:max-h-16 group-hover/card:opacity-100 transition-all duration-300 ease-in-out pt-0 group-hover/card:pt-1.5 overflow-hidden">
          <p className="text-[11px] sm:text-xs text-white/85 font-normal leading-relaxed line-clamp-2">
            {plainExcerpt}
          </p>
        </div>
      </div>
    </Link>
  );
};

export const ArticleCarousel: React.FC<ArticleCarouselProps> = ({ articles }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false, // Manual sliding between 5-article groups
    align: 'start',
    skipSnaps: false,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  // Chunk articles into groups of 5 (Slide 1: 5 latest, Slide 2: 5 previous)
  const chunks: Article[][] = [];
  for (let i = 0; i < articles.length; i += 5) {
    chunks.push(articles.slice(i, i + 5));
  }

  // Update active snap index
  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {/* Minimalist Section Header */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-1 bg-emerald-600 rounded-full" />
        <h2 className="text-sm sm:text-base font-bold tracking-tight text-foreground uppercase">
          Artikel Terbaru
        </h2>
      </div>

      <div className="relative group/carousel w-full select-none">
      {/* Carousel Container (Borderless, Gapless 1-2-2 Grid) */}
      <div ref={emblaRef} className="overflow-hidden rounded-2xl shadow-sm border-none bg-black">
        <div className="flex -ml-0">
          {chunks.map((chunk, slideIdx) => (
            <div
              key={slideIdx}
              className="min-w-0 shrink-0 grow-0 basis-full pl-0 border-none"
            >
              {/* 1-2-2 Grid Layout: 1 big card (col 1-2, row 1-2) + 4 small cards (col 3-4, row 1-2) */}
              <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 h-auto md:h-[370px] w-full gap-0 overflow-hidden bg-black border-none">
                {/* Item 0: Most recent / Featured (1) */}
                {chunk[0] && (
                  <div className="col-span-2 md:col-span-2 md:row-span-2 relative h-[220px] md:h-full overflow-hidden border-none">
                    <ArticleGridCard article={chunk[0]} isFeatured={true} />
                  </div>
                )}

                {/* Item 1: Small (2) */}
                {chunk[1] && (
                  <div className="col-span-1 md:col-span-1 md:row-span-1 relative h-[130px] md:h-full overflow-hidden border-none">
                    <ArticleGridCard article={chunk[1]} />
                  </div>
                )}

                {/* Item 2: Small (2) */}
                {chunk[2] && (
                  <div className="col-span-1 md:col-span-1 md:row-span-1 relative h-[130px] md:h-full overflow-hidden border-none">
                    <ArticleGridCard article={chunk[2]} />
                  </div>
                )}

                {/* Item 3: Small (2) */}
                {chunk[3] && (
                  <div className="col-span-1 md:col-span-1 md:row-span-1 relative h-[130px] md:h-full overflow-hidden border-none">
                    <ArticleGridCard article={chunk[3]} />
                  </div>
                )}

                {/* Item 4: Small (2) */}
                {chunk[4] && (
                  <div className="col-span-1 md:col-span-1 md:row-span-1 relative h-[130px] md:h-full overflow-hidden border-none">
                    <ArticleGridCard article={chunk[4]} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrow Buttons (Visible on hover of carousel) */}
      {chunks.length > 1 && (
        <>
          <button
            type="button"
            onClick={scrollPrev}
            disabled={selectedIndex === 0}
            aria-label="Artikel Sebelumnya"
            className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:bg-black/80 hover:scale-110 active:scale-95 focus:outline-none disabled:pointer-events-none disabled:opacity-0'
            )}
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            disabled={selectedIndex === chunks.length - 1}
            aria-label="Artikel Selanjutnya"
            className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition-all duration-300 opacity-0 group-hover/carousel:opacity-100 hover:bg-black/80 hover:scale-110 active:scale-95 focus:outline-none disabled:pointer-events-none disabled:opacity-0'
            )}
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </>
      )}

      {/* Navigation Dots (Bottom Center) */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-3">
          {scrollSnaps.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollTo(idx)}
              aria-label={`Go to slide page ${idx + 1}`}
              className={cn(
                'h-2 rounded-full transition-all duration-300 cursor-pointer focus:outline-none',
                idx === selectedIndex
                  ? 'w-6 bg-emerald-600'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
              )}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);
};
