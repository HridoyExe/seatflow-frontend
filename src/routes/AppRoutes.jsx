import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import Home from '../pages/Home';
import MenuPage from '../components/menu/MenuPage';
import MenuDetails from '../components/menu/MenuDetails';
import SeatsPage from '../components/seats/pages/SeatsPage';
import BookingPage from '../components/booking/BookingPage';
import BookingDetails from '../components/booking/BookingDetails';
import OrdersPage from '../components/orders/pages/OrdersPage';
import Login from '../auth/pages/Login';
import Register from '../auth/pages/Register';
import VerifyOTP from '../auth/pages/VerifyOTP';
import ForgotPassword from '../auth/pages/ForgotPassword';
import ResetPasswordConfirm from '../auth/pages/ResetPasswordConfirm';
import Profile from '../auth/pages/Profile';
import CheckoutPage from '../components/booking/CheckoutPage';
import PrivateRoute from './PrivateRoute';
import NotFound from '../pages/NotFound';
import PaymentSuccess from '../pages/payment/PaymentSuccess';
import PaymentFail from '../pages/payment/PaymentFail';
import PaymentCancel from '../pages/payment/PaymentCancel';
import AdminDashboard from '../components/admin/AdminDashboard';
import MemberDashboard from '../components/member/MemberDashboard';
import MyBookings from '../components/orders/pages/MyBookings';
import MyOrders from '../components/orders/pages/MyOrders';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-grow pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/menu/:id" element={<MenuDetails />} />
            <Route path="/seats" element={<SeatsPage />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPasswordConfirm />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/booking/:id" element={<BookingDetails />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/member-dashboard" element={<MemberDashboard />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/fail" element={<PaymentFail />} />
              <Route path="/payment/cancel" element={<PaymentCancel />} />
            </Route>

            {/* Admin-Only Routes */}
            <Route element={<PrivateRoute adminOnly={true} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default AppRoutes;
