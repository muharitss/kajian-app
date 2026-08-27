import React from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Layers,
  LogOut,
  UserCheck,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Kelola Artikel', path: '/admin/articles', icon: FileText },
    { label: 'Taksonomi', path: '/admin/taxonomy', icon: Layers },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-muted/20">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r bg-card p-4 flex flex-col justify-between">
        <div>
          {/* Header Brand */}
          <div className="flex items-center gap-2 font-bold text-lg text-primary pb-6 border-b mb-4">
            <span>Admin Portal</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-sm"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 border-t space-y-3 mt-6 md:mt-0">
          <div className="flex items-center gap-2 px-2 text-xs text-muted-foreground">
            <UserCheck className="h-4 w-4 text-primary" />
            <div className="truncate">
              <p className="font-medium text-foreground truncate">{user?.name}</p>
              <p className="truncate text-[10px]">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="w-full justify-start text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4 mr-2" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
