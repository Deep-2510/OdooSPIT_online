// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { NotificationProvider } from './contexts/NotificationContext';
import theme from './styles/theme';

// Layout
import AppLayout from './components/common/Layout/AppLayout';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';

// Main Pages
import Dashboard from './pages/Dashboard';
import Products from './pages/Products/Products';
import ProductDetails from './pages/Products/ProductDetails';
import ProductCreate from './pages/Products/ProductCreate';
import Receipts from './pages/Receipts/Receipts';
import ReceiptDetails from './pages/Receipts/ReceiptDetails';
import ReceiptCreate from './pages/Receipts/ReceiptCreate';
import Deliveries from './pages/Deliveries/Deliveries';
import DeliveryDetails from './pages/Deliveries/DeliveryDetails';
import DeliveryCreate from './pages/Deliveries/DeliveryCreate';
import Transfers from './pages/Transfers/Transfers';
import TransferDetails from './pages/Transfers/TransferDetails';
import TransferCreate from './pages/Transfers/TransferCreate';
import Adjustments from './pages/Adjustments/Adjustments';
import AdjustmentDetails from './pages/Adjustments/AdjustmentDetails';
import AdjustmentCreate from './pages/Adjustments/AdjustmentCreate';
import Warehouses from './pages/Warehouses/Warehouses';
import WarehouseDetails from './pages/Warehouses/WarehouseDetails';

// Advanced Pages
import AdvancedAnalytics from './pages/Advanced/Analytics/AdvancedAnalytics';
import ReportBuilder from './pages/Advanced/Reports/ReportBuilder';
import CustomReports from './pages/Advanced/Reports/CustomReports';
import SystemSettings from './pages/Advanced/Settings/SystemSettings';
import UserManagement from './pages/Advanced/Settings/UserManagement';
import AuditLogs from './pages/Advanced/Settings/AuditLogs';

// Mobile Pages
import MobileDashboard from './pages/Mobile/MobileDashboard';
import BarcodeScanner from './pages/Mobile/BarcodeScanner';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

// App Content with Routing
function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />

        {/* Protected Routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Product Management */}
        <Route path="/products" element={
          <ProtectedRoute>
            <AppLayout>
              <Products />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/products/create" element={
          <ProtectedRoute>
            <AppLayout>
              <ProductCreate />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/products/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <ProductDetails />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/products/:id/edit" element={
          <ProtectedRoute>
            <AppLayout>
              <ProductCreate />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Receipt Management */}
        <Route path="/receipts" element={
          <ProtectedRoute>
            <AppLayout>
              <Receipts />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/receipts/create" element={
          <ProtectedRoute>
            <AppLayout>
              <ReceiptCreate />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/receipts/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <ReceiptDetails />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Delivery Management */}
        <Route path="/deliveries" element={
          <ProtectedRoute>
            <AppLayout>
              <Deliveries />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/deliveries/create" element={
          <ProtectedRoute>
            <AppLayout>
              <DeliveryCreate />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/deliveries/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <DeliveryDetails />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Transfer Management */}
        <Route path="/transfers" element={
          <ProtectedRoute>
            <AppLayout>
              <Transfers />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/transfers/create" element={
          <ProtectedRoute>
            <AppLayout>
              <TransferCreate />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/transfers/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <TransferDetails />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Adjustment Management */}
        <Route path="/adjustments" element={
          <ProtectedRoute>
            <AppLayout>
              <Adjustments />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/adjustments/create" element={
          <ProtectedRoute>
            <AppLayout>
              <AdjustmentCreate />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/adjustments/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <AdjustmentDetails />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Warehouse Management */}
        <Route path="/warehouses" element={
          <ProtectedRoute>
            <AppLayout>
              <Warehouses />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/warehouses/:id" element={
          <ProtectedRoute>
            <AppLayout>
              <WarehouseDetails />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Advanced Features */}
        <Route path="/analytics" element={
          <ProtectedRoute>
            <AppLayout>
              <AdvancedAnalytics />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <AppLayout>
              <CustomReports />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/reports/builder" element={
          <ProtectedRoute>
            <AppLayout>
              <ReportBuilder />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <AppLayout>
              <SystemSettings />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <AppLayout>
              <UserManagement />
            </AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/audit-logs" element={
          <ProtectedRoute>
            <AppLayout>
              <AuditLogs />
            </AppLayout>
          </ProtectedRoute>
        } />

        {/* Mobile Routes */}
        <Route path="/mobile" element={
          <ProtectedRoute>
            <MobileDashboard />
          </ProtectedRoute>
        } />
        <Route path="/scan" element={
          <ProtectedRoute>
            <BarcodeScanner />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AuthProvider>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;