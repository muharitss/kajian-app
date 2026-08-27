import React from 'react';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t bg-muted/30 py-6 sm:py-8 mt-8 sm:mt-16 text-xs text-muted-foreground">
      <div className="container mx-auto px-3 sm:px-4 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 font-medium text-foreground">
          <span>Portal Kajian Islam</span>
        </div>
        <p className="text-center md:text-right">
          © {new Date().getFullYear()} Portal Kajian. Platform Berbagi Ilmu & Artikel Islami Terstruktur.
        </p>
      </div>
    </footer>
  );
};
