import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DynamicMeta } from '@/shared/components/common/DynamicMeta';
import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Mail, Key, AlertCircle } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Email dan Password wajib diisi');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      setAuth(res.token, res.user);
      navigate('/admin/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login gagal. Periksa kredensial Anda.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <DynamicMeta title="Admin Login" noIndex={true} />
      <Card className="w-full max-w-md shadow-lg border">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto p-3 rounded-full bg-primary/10 text-primary w-fit mb-2">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold">Portal Admin Kajian</CardTitle>
          <CardDescription className="text-xs">
            Masuk dengan akun pengelola terverifikasi
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-md bg-destructive/15 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Email Admin</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="admin@kajian.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground">Password</label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-9 pl-9 pr-3 text-sm rounded-md border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="pt-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Proses Autentikasi...' : 'Masuk Portal Admin'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
