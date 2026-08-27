import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '@/pages/public/HomePage';
import { ArticleDetailPage } from '@/pages/public/ArticleDetailPage';
import { NotFoundPage } from '@/pages/public/NotFoundPage';
import { AdminLoginPage } from '@/pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage';
import { AdminArticleListPage } from '@/pages/admin/AdminArticleListPage';
import { AdminArticleEditorPage } from '@/pages/admin/AdminArticleEditorPage';
import { AdminTaxonomyPage } from '@/pages/admin/AdminTaxonomyPage';
import { AdminLayout } from '@/shared/components/layout/AdminLayout';
import { AdminGuard } from './AdminGuard';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Reader Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/hukum-islam" element={<HomePage />} />
        <Route path="/hukum-islam/:tagSlug" element={<HomePage />} />
        <Route path="/belajar-islam" element={<HomePage />} />
        <Route path="/belajar-islam/:tagSlug" element={<HomePage />} />
        <Route path="/article/:slug" element={<ArticleDetailPage />} />

        {/* Hidden Admin Entrance Login Route */}
        <Route path="/gate-admin-x9/login" element={<AdminLoginPage />} />

        {/* Protected Admin Portal Routes */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="articles" element={<AdminArticleListPage />} />
          <Route path="articles/new" element={<AdminArticleEditorPage />} />
          <Route path="articles/edit/:id" element={<AdminArticleEditorPage />} />
          <Route path="taxonomy" element={<AdminTaxonomyPage />} />
        </Route>

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
