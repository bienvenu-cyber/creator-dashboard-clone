import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const NAV_ROUTES: Record<string, string> = {
  Home: '/my/statistics/overview/earnings',
  Notifications: '/my/notifications',
  Statements: '/my/statements/earnings',
  Statistics: '/my/statistics/overview/earnings',
};

export default function DashboardLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'navigate' && e.data?.route) {
        navigate(e.data.route);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [navigate]);

  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Outlet />
    </div>
  );
}

export { NAV_ROUTES };
