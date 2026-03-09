import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IframePage } from '@/components/dashboard/IframePage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const PAGES = [
  { path: '/my/notifications', src: '/notifications.html', title: 'Notifications' },
  { path: '/my/statements/earnings', src: '/statements.html', title: 'Statements' },
  { path: '/my/statistics', src: '/statistics.html', title: 'Statistics' },
];

const NAV_ROUTES: Record<string, string> = {
  Home: '/my/statistics/overview/earnings',
  Notifications: '/my/notifications',
  Statements: '/my/statements/earnings',
  Statistics: '/my/statistics/overview/earnings',
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Handle auth callback from landing page
    const handleAuthCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          toast.error("Failed to restore session");
          console.error(error);
        } else {
          toast.success("Welcome back!");
          // Clean URL
          window.history.replaceState({}, "", "/");
        }
      }
    };

    handleAuthCallback();
  }, []);

  useEffect(() => {
    // Redirect root to statistics
    if (location.pathname === '/') {
      navigate('/my/statistics/overview/earnings', { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'navigate' && e.data?.route) {
        navigate(e.data.route);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [navigate]);

  const currentPath = location.pathname;

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {PAGES.map((page) => {
        const isActive = currentPath.startsWith(page.path);
        return (
          <div
            key={page.path}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              visibility: isActive ? 'visible' : 'hidden',
              pointerEvents: isActive ? 'auto' : 'none',
            }}
          >
            <IframePage src={page.src} title={page.title} />
          </div>
        );
      })}
    </div>
  );
}

export { NAV_ROUTES };
