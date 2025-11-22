import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import AppLayout from './components/common/Layout/AppLayout'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import ForgotPassword from './pages/Auth/ForgotPassword'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products/Products'
import ProductDetails from './pages/Products/ProductDetails'
import ProductCreate from './pages/Products/ProductCreate'
import Receipts from './pages/Receipts/Receipts'
import Deliveries from './pages/Deliveries/Deliveries'
import Transfers from './pages/Transfers/Transfers'
import Adjustments from './pages/Adjustments/Adjustments'
import Warehouses from './pages/Warehouses/Warehouses'
import StockReports from './pages/Reports/StockReports'
import './App.css'

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/create" element={<ProductCreate />} />
              <Route path="products/:id" element={<ProductDetails />} />
              <Route path="receipts" element={<Receipts />} />
              <Route path="deliveries" element={<Deliveries />} />
              <Route path="transfers" element={<Transfers />} />
              <Route path="adjustments" element={<Adjustments />} />
              <Route path="warehouses" element={<Warehouses />} />
              <Route path="reports" element={<StockReports />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </NotificationProvider>
    </Router>
  )
}

export default App