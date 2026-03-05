import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import DashboardLayout from "./pages/DashboardLayout";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";


import { HomePage } from "@/components/dashboard/pages/HomePage";
import { NotificationsPage } from "@/components/dashboard/pages/NotificationsPage";
import { MessagesPage } from "@/components/dashboard/pages/MessagesPage";
import { CollectionsPage } from "@/components/dashboard/pages/CollectionsPage";
import { VaultPage } from "@/components/dashboard/pages/VaultPage";
import { QueuePage } from "@/components/dashboard/pages/QueuePage";
import { DeclarationsPage } from "@/components/dashboard/pages/DeclarationsPage";
import { StatisticsPage } from "@/components/dashboard/pages/StatisticsPage";
import { ProfilePage } from "@/components/dashboard/pages/ProfilePage";

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
            <Route path="/welcome" element={<GhostDashLanding />} />
            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
            
            {/* Dashboard routes */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<HomePage />} />
              <Route path="my/notifications" element={<NotificationsPage />} />
              <Route path="my/chats" element={<MessagesPage />} />
              <Route path="my/collections/user-lists/subscribers/active" element={<CollectionsPage />} />
              <Route path="my/vault/list/all" element={<VaultPage />} />
              <Route path="my/queue" element={<QueuePage />} />
              <Route path="my/statements/earnings" element={<DeclarationsPage />} />
              <Route path="my/statistics/statements/earnings" element={<StatisticsPage />} />
              <Route path="my/statistics/overview/earnings" element={<StatisticsPage />} />
              <Route path="my/statistics/engagement/posts" element={<StatisticsPage />} />
              <Route path="my/statistics/reach/profile-visitors" element={<StatisticsPage />} />
              <Route path="my/statistics/fans/subscriptions" element={<StatisticsPage />} />
              <Route path="/u495354766" element={<ProfilePage />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
