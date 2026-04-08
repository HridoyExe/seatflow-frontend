import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, Printer, Download, Calendar, Clock, 
  MapPin, Armchair, Users, Receipt, CreditCard, 
  CheckCircle2, AlertCircle, Loader2, Utensils
} from 'lucide-react';
import { useBookingDetails, useOrderItems } from '../../hooks/useBooking';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: booking, isLoading: isBookingLoading, isError: isBookingError } = useBookingDetails(id);
  const { data: orderItemsData, isLoading: isOrdersLoading } = useOrderItems(id);
  
  const orderItems = Array.isArray(orderItemsData) ? orderItemsData : (orderItemsData?.results || []);

  if (isBookingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={48} className="animate-spin text-orange-600 mx-auto mb-4" />
          <p className="text-slate-500 font-bold animate-pulse">Loading receipt details...</p>
        </div>
      </div>
    );
  }

  if (isBookingError || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 text-center">
        <div className="bg-white p-12 rounded-[3rem] shadow-xl border border-red-50 max-w-md">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Reservation Not Found</h2>
          <p className="text-slate-500 mb-8">We couldn't locate the reservation details for ID #{id}. It may have been archived or deleted.</p>
          <button 
            onClick={() => navigate('/orders')}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:scale-105 transition-all"
          >
            Back to My Orders
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 print:bg-white print:py-0">
      <div className="container mx-auto max-w-4xl">
        
        <div className="flex items-center justify-between mb-8 print:hidden">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors group"
          >
            <div className="p-2 rounded-xl bg-white border border-slate-100 group-hover:border-orange-200 transition-all">
              <ChevronLeft size={20} />
            </div>
            Back
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-50 transition-all"
            >
              <Printer size={18} />
              Print Receipt
            </button>
            <button className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-600/20 transition-all">
              <Download size={18} />
              Download PDF
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden print:shadow-none print:border-none">
          
          <div className="bg-slate-900 p-10 md:p-14 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-orange-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                    {booking.status}
                  </span>
                  <span className="text-slate-400 text-sm font-medium">#{booking.id}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">Reservation Receipt</h1>
                <p className="text-slate-400 font-medium">Thank you for choosing SeatFlow for your dining experience.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/10 text-center">
                 <div className="text-orange-500 font-black text-3xl mb-1">৳{parseFloat(booking.amount || 0).toFixed(2)}</div>
                 <div className="text-[10px] uppercase font-black text-white/50 tracking-widest">Total Amount</div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600 rounded-full blur-[120px] opacity-20 -mr-48 -mt-48"></div>
          </div>

          <div className="p-8 md:p-14">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-14">
              {/* Left Column: Reservation Info */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Table Selection</h4>
                  <div className="flex items-center gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm border border-slate-50">
                      <Armchair size={32} />
                    </div>
                    <div>
                      <div className="text-xl font-black text-slate-900">{booking.seat_number ? `Table ${booking.seat_number}` : `Seat #${booking.seat}`}</div>
                      <div className="text-slate-500 font-medium">{booking.number_of_guests || 1} Guests Reservation</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Date & Time</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center gap-3">
                      <Calendar className="text-orange-600" size={20} />
                      <span className="font-bold text-slate-700">{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                    <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100 flex items-center gap-3">
                      <Clock className="text-orange-600" size={20} />
                      <span className="font-bold text-slate-700">{booking.start_time}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Customer Info */}
              <div className="space-y-8">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Customer Details</h4>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm font-medium">Reserved By</span>
                      <span className="text-slate-900 font-bold">{booking.name || 'Customer'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm font-medium">Contact</span>
                      <span className="text-slate-900 font-bold">{booking.phone || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-sm font-medium">Email</span>
                      <span className="text-slate-900 font-bold">{booking.email || 'N/A'}</span>
                    </div>
                    {booking.address && (
                      <div className="flex flex-col pt-2 border-t border-slate-200 mt-2">
                        <span className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Full Address</span>
                        <span className="text-slate-900 font-medium text-sm leading-relaxed">{booking.address}</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-2 border-t border-slate-200">
                      <span className="text-slate-400 text-sm font-medium">Status</span>
                      <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <CheckCircle2 size={16} /> {booking.is_paid ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>

                {booking.special_requests && (
                  <div>
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Special Requests</h4>
                    <p className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 italic text-slate-600 font-medium leading-relaxed">
                      "{booking.special_requests}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Ordered Items</h4>
                <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-black">{orderItems.length} Items</span>
              </div>
              
              <div className="bg-slate-50 rounded-[2.5rem] border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider">Item</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider text-center">Qty</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase text-slate-400 tracking-wider text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {isOrdersLoading ? (
                      <tr>
                        <td colSpan="3" className="px-8 py-10 text-center text-slate-400 italic">Loading items...</td>
                      </tr>
                    ) : orderItems.length > 0 ? (
                      orderItems.map((item, idx) => (
                        <tr key={idx} className="group hover:bg-white transition-colors">
                          <td className="px-8 py-5 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-orange-400 border border-slate-100 shadow-sm">
                              <Utensils size={20} />
                            </div>
                            <span className="font-bold text-slate-800">{item.menu_item_name || 'Menu Item'}</span>
                          </td>
                          <td className="px-8 py-5 text-center font-black text-slate-500">x{item.quantity}</td>
                          <td className="px-8 py-5 text-right font-black text-slate-900">৳{(parseFloat(item.price || 0) * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-8 py-10 text-center text-slate-400 italic">No food items were added to this reservation.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 pt-8 border-t-2 border-dashed border-slate-100">
               <div className="flex justify-between w-full md:w-80">
                  <span className="text-slate-400 font-bold">Subtotal</span>
                  <span className="text-slate-900 font-black">৳{parseFloat(booking.amount || 0).toFixed(2)}</span>
               </div>
               <div className="flex justify-between w-full md:w-80">
                  <span className="text-slate-400 font-bold">Service Tax (0%)</span>
                  <span className="text-slate-900 font-black">৳0.00</span>
               </div>
               <div className="flex justify-between w-full md:w-80 pt-4 border-t border-slate-100 mt-2">
                  <span className="text-2xl font-black text-slate-900">Total</span>
                  <span className="text-2xl font-black text-orange-600">৳{parseFloat(booking.amount || 0).toFixed(2)}</span>
               </div>
            </div>

            <div className="mt-16 pt-12 border-t border-slate-50 flex flex-col items-center text-center">
               <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 text-slate-200">
                  <div className="grid grid-cols-3 gap-1">
                    {[1,2,3,4,5,6,7,8,9].map(i => <div key={i} className="w-4 h-4 bg-slate-200 rounded-sm"></div>)}
                  </div>
               </div>
               <p className="text-slate-400 text-sm font-medium max-w-sm">
                 Please present this receipt at the restaurant reception. We look forward to serving you!
               </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center print:hidden">
          <Link 
            to="/orders"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 font-black uppercase text-xs tracking-[0.2em] transition-all"
          >
            ← Back to History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
