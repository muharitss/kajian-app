import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-4 max-w-md">
        <AlertTriangle className="h-16 w-16 text-muted-foreground mx-auto opacity-40" />
        <h1 className="text-3xl font-extrabold tracking-tight">404 - Halaman Tidak Ditemukan</h1>
        <p className="text-sm text-muted-foreground">
          Halaman yang Anda tuju tidak tersedia atau rute tidak valid.
        </p>
        <Link to="/">
          <Button size="sm">Kembali ke Beranda</Button>
        </Link>
      </div>
    </div>
  );
};
