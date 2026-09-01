import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useArticleDetail } from "@/features/articles/hooks/useArticles";
import { RelatedArticles } from "@/features/articles/components/RelatedArticles";
import { PublicNavbar } from "@/shared/components/layout/PublicNavbar";
import { PublicFooter } from "@/shared/components/layout/PublicFooter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Eye, User, Share2, Check } from "lucide-react";
import DOMPurify from 'dompurify';
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useArticleDetail(slug || "");
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wordCount = article?.content ? article.content.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const formattedDate = article?.createdAt
    ? format(new Date(article.createdAt), "EEEE, dd MMMM yyyy", {
        locale: idLocale,
      })
    : "";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PublicNavbar />

      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-4xl space-y-4 sm:space-y-6">
        {/* Back navigation & Breadcrumb */}
        <div className="flex items-center justify-between gap-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-xs px-2 sm:px-3">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Kembali ke Daftar Artikel
            </Button>
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="text-xs px-2 sm:px-3"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1 text-emerald-600" />
                Tersalin!
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5 mr-1" />
                Bagikan
              </>
            )}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="space-y-6">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="aspect-video w-full rounded-xl" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        )}

        {/* Error / Not Found State */}
        {(isError || (!isLoading && !article)) && (
          <div className="p-8 sm:p-12 text-center border rounded-xl bg-card space-y-4 my-8 sm:my-12">
            <h2 className="text-lg sm:text-xl font-bold">
              Artikel Tidak Ditemukan
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Artikel yang Anda cari mungkin telah dihapus atau berada dalam
              status Draft.
            </p>
            <Link to="/">
              <Button size="sm">Kembali ke Beranda</Button>
            </Link>
          </div>
        )}

        {/* Article View */}
        {!isLoading && article && (
          <article className="space-y-4 sm:space-y-6">
            {/* Header Metadata */}
            <div className="space-y-2 sm:space-y-3 border-b pb-4 sm:pb-6">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {article.tags?.map((t) => (
                  <Badge
                    key={t.id}
                    variant="default"
                    className="text-xs py-0.5"
                  >
                    #{t.name}
                  </Badge>
                ))}
              </div>

              <h1 className="text-xl sm:text-3xl md:text-4xl font-bold sm:font-extrabold tracking-tight text-foreground leading-snug sm:leading-tight">
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-muted-foreground pt-1 sm:pt-2">
                {article.ustadz && (
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <User className="h-3.5 w-3.5 text-primary" />
                    Ust. {article.ustadz.name}
                  </span>
                )}
                <span>{formattedDate}</span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {readingTime} min
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {article.viewCount}x dibaca
                </span>
              </div>
            </div>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            {/* Excerpt Summary Box (if present) */}
            {article.excerpt && (
              <div className="p-3 sm:p-4 rounded-lg bg-primary/5 border-l-4 border-primary text-xs sm:text-sm font-medium leading-relaxed italic text-foreground">
                "{article.excerpt}"
              </div>
            )}

            {/* Article Main Prose Body */}
            <div
              className="prose prose-slate max-w-none text-foreground leading-relaxed text-sm sm:text-base md:text-lg py-2 sm:py-4"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(article.content),
              }}
            />

            {/* Ustadz Bio Footer Card */}
            {article.ustadz?.bio && (
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-foreground">
                  Pemateri: Ust. {article.ustadz.name}
                </h4>
              </div>
            )}
          </article>
        )}

        {/* Related Articles Section */}
        {!isLoading && article && (
          <RelatedArticles currentSlug={slug || ""} />
        )}
      </main>

      <PublicFooter />
    </div>
  );
};
