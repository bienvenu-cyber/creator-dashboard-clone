import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import DashboardLayout from "./pages/DashboardLayout";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

import { NotificationsPage } from "@/components/dashboard/pages/NotificationsPage";
import { DeclarationsPage } from "@/components/dashboard/pages/DeclarationsPage";
import { StatisticsPage } from "@/components/dashboard/pages/StatisticsPage";

const queryClient = new QueryClient();

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" /></div>;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Navigate to="/my/statistics/overview/earnings" replace />} />
              <Route path="my/notifications" element={<NotificationsPage />} />
              <Route path="my/statements/earnings" element={<DeclarationsPage />} />
              <Route path="my/statistics/*" element={<StatisticsPage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
