import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";

import { ScrollRestoration } from "./components/ScrollRestoration";
import { ErrorBoundary } from '@/components/feedback/ErrorBoundary';
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import OptimizedAutoAlertMonitor from '@/components/alerts/OptimizedAutoAlertMonitor';
import Index from "./pages/Index";
import StatsPage from "./pages/StatsPage";
import ProductsPage from "./pages/ProductsPage";
import InventoryPage from "./pages/InventoryPage";
import AssetsPage from "./pages/AssetsPage";
import MorePage from "./pages/MorePage";
import OrdersPage from "./pages/OrdersPage";
import AlertsPage from "./pages/AlertsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";
import DatabasePage from "./pages/DatabasePage";
import SecurityPage from "./pages/SecurityPage";
import StockReportPage from "./pages/StockReportPage";
import StockMovementPage from "./pages/StockMovementPage";
import StockOpnamePage from "./pages/StockOpnamePage";
import DocumentationPage from "./pages/DocumentationPage";
import AIStudioPage from "./pages/AIStudioPage";
import { ApiManagementPage } from "./pages/ApiManagementPage";
import VendorsPage from "./pages/VendorsPage";
import AdminMonitorPage from "./pages/AdminMonitorPage";
import NotFound from "./pages/NotFound";



const App = () => (
  <ErrorBoundary>
    <TooltipProvider>
      <ScrollRestoration />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/stats" element={<StatsPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
        <Route path="/stock-opname" element={<StockOpnamePage />} />
        <Route path="/documentation" element={<DocumentationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/ai-studio" element={<AIStudioPage />} />
        <Route path="/vendors" element={<VendorsPage />} />
        <Route path="/more" element={<MorePage />} />

        {/* Admin-only routes */}
        <Route path="/users" element={
          <ProtectedRoute requiredRole="admin">
            <UsersPage />
          </ProtectedRoute>
        } />
        <Route path="/stock-movement" element={
          <ProtectedRoute requiredRole="admin">
            <StockMovementPage />
          </ProtectedRoute>
        } />
        <Route path="/api-management" element={
          <ProtectedRoute requiredRole="admin">
            <ApiManagementPage />
          </ProtectedRoute>
        } />
        <Route path="/security" element={
          <ProtectedRoute requiredRole="admin">
            <SecurityPage />
          </ProtectedRoute>
        } />
        <Route path="/stock-report" element={
          <ProtectedRoute requiredRole="admin">
            <StockReportPage />
          </ProtectedRoute>
        } />

        {/* Super admin-only routes */}
        <Route path="/database" element={
          <ProtectedRoute requiredRole="superadmin">
            <DatabasePage />
          </ProtectedRoute>
        } />
        <Route path="/admin-monitor" element={
          <ProtectedRoute requiredRole="superadmin">
            <AdminMonitorPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <OptimizedAutoAlertMonitor />
    </TooltipProvider>
  </ErrorBoundary>
);

export default App;