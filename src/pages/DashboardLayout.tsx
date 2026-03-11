import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IframePage } from '@/components/dashboard/IframePage';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      || window.innerWidth <= 768;
  });
  useEffect(() => {
    const check = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || window.innerWidth <= 768
      );
    };
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

const DESKTOP_PAGES = [
  { path: '/my/notifications', src: '/notifications.html', title: 'Notifications' },
  { path: '/my/statements/earnings', src: '/statements.html', title: 'Statements' },
  { path: '/my/statistics', src: '/statistics.html', title: 'Statistics' },
];

const MOBILE_PAGES = [
  { path: '/my/statements/earnings', src: '/statements-mobile.html', title: 'Statements Mobile' },
  { path: '/my/statistics', src: '/statistics-mobile.html', title: 'Statistics Mobile' },
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
  const isMobile = useIsMobile();

  useEffect(() => {
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
          window.history.replaceState({}, "", "/");
        }
      }
    };

    handleAuthCallback();
  }, []);

  useEffect(() => {
    // On mobile, default to statements; on desktop, default to statistics
    if (location.pathname === '/') {
      if (isMobile) {
        navigate('/my/statements/earnings', { replace: true });
      } else {
        navigate('/my/statistics/overview/earnings', { replace: true });
      }
    }
  }, [location.pathname, navigate, isMobile]);

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
  const pages = isMobile ? MOBILE_PAGES : DESKTOP_PAGES;

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {pages.map((page) => {
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
