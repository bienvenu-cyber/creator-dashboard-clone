import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Outlet />
    </div>
  );
}
