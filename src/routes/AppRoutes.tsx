import { Route, Routes } from 'react-router-dom';

import { HomePage } from '../pages/HomePage';
import { UIPreviewPage } from '../pages/UIPreviewPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { AboutPage } from '../pages/AboutPage';
import { FounderPage } from '../pages/FounderPage';
import { GalleryPage } from '../pages/GalleryPage';
import { ConsultancyPage } from '../pages/ConsultancyPage';
import { ContactPage } from '../pages/ContactPage';

import { ProductsPage } from '../pages/ProductsPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { TrainingPage } from '../pages/TrainingPage';
import { TrainingDetailsPage } from '../pages/TrainingDetailsPage';
import { TrainingAccessPage } from '../pages/TrainingAccessPage';

import { LoginPage } from '../pages/LoginPage';
import { AccountPage } from '../pages/AccountPage';
import { CartPage } from '../pages/CartPage';
import { PaymentPage } from '../pages/PaymentPage';
import { PaymentSubmittedPage } from '../pages/PaymentSubmittedPage';
import { MyOrdersPage } from '../pages/MyOrdersPage';
import { OrderDetailsPage } from '../pages/OrderDetailsPage';
import { ReceiptPage } from '../pages/ReceiptPage';

import { AdminLayout } from '../pages/admin/AdminLayout';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminOrderDetailPage } from '../pages/admin/AdminOrderDetailPage';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminTrainingPage } from '../pages/admin/AdminTrainingPage';
import { AdminBookingsPage } from '../pages/admin/AdminBookingsPage';
import { AdminQueriesPage } from '../pages/admin/AdminQueriesPage';
import { AdminGalleryPage } from '../pages/admin/AdminGalleryPage';

import { AdminRoute, ProtectedRoute } from './Guards';

/**
 * All application routes.
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />
      <Route path="/ui-preview" element={<UIPreviewPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/founder" element={<FounderPage />} />
      <Route path="/gallery" element={<GalleryPage />} />
      <Route path="/consultancy" element={<ConsultancyPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Commerce (public) */}
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductDetailsPage />} />
      <Route path="/training" element={<TrainingPage />} />
      <Route path="/training/:slug" element={<TrainingDetailsPage />} />
      <Route
        path="/training/:slug/access"
        element={
          <ProtectedRoute>
            <TrainingAccessPage />
          </ProtectedRoute>
        }
      />

      <Route path="/cart" element={<CartPage />} />

      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected */}
      <Route
        path="/account"
        element={
          <ProtectedRoute>
            <AccountPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <PaymentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-submitted/:ref"
        element={
          <ProtectedRoute>
            <PaymentSubmittedPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <MyOrdersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:ref"
        element={
          <ProtectedRoute>
            <OrderDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:ref/receipt"
        element={
          <ProtectedRoute>
            <ReceiptPage />
          </ProtectedRoute>
        }
      />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="orders/:ref" element={<AdminOrderDetailPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="training" element={<AdminTrainingPage />} />
        <Route path="bookings" element={<AdminBookingsPage />} />
        <Route path="queries" element={<AdminQueriesPage />} />
        <Route path="gallery" element={<AdminGalleryPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
