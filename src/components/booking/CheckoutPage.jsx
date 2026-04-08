import React, { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  ChevronLeft,
  Utensils,
  Armchair,
  Calendar as CalendarIcon,
  ShieldCheck,
  ArrowRight,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { useCreateBooking } from '../../hooks/useBooking';
import { useInitiatePayment } from '../../hooks/usePayment';
import { useCart } from '../../context/CartContext';
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";
import apiClient from "../../services/apiClient";
import { apiEndpoints } from "../../api/endpoints";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartTotal, clearCart, removeFromCart } = useCart();
  const { user } = useAuth();

  const bookingData = location.state?.bookingData || {
    seatId: "T1",
    date: "2023-10-24",
    time: "19:30",
    guests: 2,
    specialRequests: "",
  };

  const [billingInfo, setBillingInfo] = useState({
    name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || ""
  });

  const totalAmount = 15.0 + cartTotal;

  const createBookingMutation = useCreateBooking();
  const initiatePaymentMutation = useInitiatePayment();

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      // 1. Create the booking
      const startTime = bookingData.time.length === 5 ? `${bookingData.time}:00` : bookingData.time;
      const startHour = parseInt(startTime.split(':')[0]);
      const endHour = (startHour + 2) % 24;
      const endTime = `${endHour.toString().padStart(2, '0')}:${startTime.split(':')[1]}:00`;

      // Handle optional seat (Support Food-only orders)
      const seatId = parseInt(bookingData.seatId);
      const isTableBooking = !isNaN(seatId);

      const bookingPayload = {
        seat: isTableBooking ? seatId : null,
        booking_date: bookingData.date || new Date().toISOString().split('T')[0],
        start_time: startTime || "12:00:00",
        end_time: endTime || "14:00:00",
        name: billingInfo.name,
        phone: billingInfo.phone,
        email: billingInfo.email,
        address: billingInfo.address,
        special_request: bookingData.specialRequests || "",
        number_of_guests: parseInt(bookingData.guests) || 1
      };

      const booking = await createBookingMutation.mutateAsync(bookingPayload);
      
      if (!booking?.id) {
        throw new Error("Failed to create booking record correctly.");
      }

      // 2. Add Order Items if cart not empty
      if (cart.length > 0) {
        const orderItemPromises = cart.map(item => 
          apiClient.post(apiEndpoints.booking.orderItems, {
            booking: booking.id, // Now writable in backend
            menu_item: item.id,
            quantity: item.quantity
          })
        );
        await Promise.all(orderItemPromises);
      }

      // 3. Initiate payment
      clearCart();
      await initiatePaymentMutation.mutateAsync({
        amount: parseFloat(totalAmount.toFixed(2)),
        orderId: parseInt(booking.id), 
        numItems: (isTableBooking ? 1 : 0) + cart.length 
      });

    } catch (err) {
      console.error("Checkout Flow Error:", err.response?.data || err);
      const errorMessage = err.response?.data?.error || err.response?.data?.message || err.message || "Checkout failed.";
      toast.error(errorMessage);
    }
  };

  const isSubmitting = createBookingMutation.isPending || initiatePaymentMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50 pb-32 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-md mx-auto xl:max-w-7xl">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <ChevronLeft className="text-slate-700" size={24} />
            </button>
            <h1 className="text-lg font-bold tracking-tight text-center flex-1 pr-6">
              Checkout & Payment
            </h1>
          </div>
          <div className="px-6 pb-4 pt-2 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">
                Booking Info
              </span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Payment Gateway
              </span>
            </div>
            <div className="relative h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-orange-500 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* Summary Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Reservation Summary
            </h2>
            <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
              Pending
            </span>
          </div>

          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
              <Utensils size={32} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 text-lg">SeatFlow Gourmet</h3>
              <p className="text-sm text-slate-500">Premium Dining Experience</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100">
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-slate-400">Selected Seat</p>
              <div className="flex items-center gap-2">
                <Armchair className="text-orange-600" size={16} />
                <p className="font-semibold text-sm text-slate-800">Table {bookingData.seatId}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] uppercase font-bold text-slate-400">Date & Time</p>
              <div className="flex items-center gap-2">
                <CalendarIcon className="text-orange-600" size={16} />
                <p className="font-semibold text-sm text-slate-800">{bookingData.date}, {bookingData.time}</p>
              </div>
            </div>
          </div>

          {/* Cart Items */}
          {cart.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-[10px] uppercase font-bold text-slate-400">Menu Selections</p>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">{item.name}</span>
                    <span className="text-[10px] text-slate-500">{item.quantity} x ৳{Number(item.price).toFixed(0)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900">৳{(item.price * item.quantity).toFixed(0)}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500">Reservation Fee</span>
              <span className="font-semibold text-slate-900">৳15.00</span>
            </div>
            {cartTotal > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Food Subtotal</span>
                <span className="font-semibold text-slate-900">৳{cartTotal.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between items-center pt-2 border-t border-dashed border-slate-200">
              <span className="text-slate-900 font-bold">Total Payable</span>
              <span className="text-2xl font-black text-orange-600">৳{totalAmount.toFixed(0)}</span>
            </div>
          </div>
        </section>

        <form onSubmit={handlePayment} id="checkout-form" className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-lg font-bold px-1 text-slate-900">Billing Information</h2>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-orange-500/20 placeholder:text-slate-400 transition-all outline-none"
                  placeholder="John Doe"
                  value={billingInfo.name}
                  onChange={(e) => setBillingInfo({...billingInfo, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase px-1">Phone</label>
                  <input
                    required
                    type="tel"
                    className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                    placeholder="+880 1xxx"
                    value={billingInfo.phone}
                    onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase px-1">Email</label>
                  <input
                    required
                    type="email"
                    className="w-full h-12 bg-slate-50 border-none rounded-xl px-4 text-sm focus:ring-2 focus:ring-orange-500/20 outline-none"
                    placeholder="john@example.com"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase px-1">Full Address</label>
                <textarea
                  required
                  rows="2"
                  className="w-full bg-slate-50 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500/20 placeholder:text-slate-400 transition-all outline-none resize-none"
                  placeholder="Enter your full address"
                  value={billingInfo.address}
                  onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Secure Payment</h3>
              <p className="text-slate-500 text-sm mt-1">
                Securely redirected to SSL Commerz to complete payment.
              </p>
            </div>
          </section>
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 pb-6 z-40">
        <div className="max-w-md mx-auto">
          <button
            type="submit"
            form="checkout-form"
            disabled={isSubmitting}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-black h-14 md:h-16 rounded-2xl shadow-xl flex items-center justify-center px-4 transition-all active:scale-[0.98] group"
          >
            {isSubmitting ? (
              <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm sm:text-lg whitespace-nowrap overflow-hidden text-ellipsis">Pay with SSL Commerz</span>
                <ArrowRight size={22} className="ml-2 group-hover:translate-x-1 transition-transform shrink-0" />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
