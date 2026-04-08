import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarHeart, Users, Clock, Info, Loader2 } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { useSeats } from '../../hooks/useBooking';

const BookingPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSeatId = location.state?.selectedSeat || '';

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    seatId: selectedSeatId,
    name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : "",
    phone: user?.phone || "",
    email: user?.email || "",
    date: today,
    time: '19:00',
    guests: 2,
    specialRequests: ''
  });

  const { data: seatsData, isLoading } = useSeats({
    date: formData.date,
    start_time: formData.time
  });
  const availableSeats = Array.isArray(seatsData) ? seatsData.filter(s => s.is_active !== false) : (seatsData?.results?.filter(s => s.is_active !== false) || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Redirect to checkout with form data
    setTimeout(() => {
      navigate('/checkout', { state: { bookingData: formData } });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        
        {/* Header Section */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-50 text-orange-600 rounded-full mb-4 shadow-sm border border-orange-100">
             <CalendarHeart size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Complete Reservation</h1>
          <p className="text-slate-500 text-lg">Provide your details to secure your dining experience.</p>
        </div>

        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden animate-fade-in-up">
          <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center relative overflow-hidden">
             <div className="relative z-10">
                <h3 className="font-bold text-xl">Reservation Details</h3>
                <p className="text-slate-400 text-sm mt-1">Please fill out all required fields.</p>
             </div>
             <div className="absolute right-0 top-0 w-64 h-64 bg-orange-600 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20"></div>
          </div>
          
          <form className="p-8 md:p-10 space-y-8" onSubmit={handleSubmit}>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Seat Selection */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-slate-700 uppercase text-xs tracking-wider">Select Table</span>
                </label>
                <select 
                  className="select select-bordered w-full h-14 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl font-medium"
                  name="seatId"
                  value={formData.seatId}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Choose a table</option>
                  {availableSeats.map(seat => (
                    <option key={seat.id} value={seat.id}>
                      Table {seat.seat_number} ({seat.capacity} Guests)
                    </option>
                  ))}
                  {availableSeats.length === 0 && !isLoading && (
                    <option disabled>No tables available</option>
                  )}
                  {isLoading && (
                    <option disabled>Loading tables...</option>
                  )}
                </select>
              </div>

              {/* Number of Guests */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-slate-700 uppercase text-xs tracking-wider">Number of Guests</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Users size={18} />
                  </div>
                  <input 
                    type="number" 
                    min="1" 
                    max="20"
                    className="input input-bordered w-full pl-12 h-14 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl font-medium"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Date */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-slate-700 uppercase text-xs tracking-wider">Date</span>
                </label>
                <input 
                  type="date" 
                  min={today}
                  className="input input-bordered w-full h-14 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl font-medium"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Time */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold text-slate-700 uppercase text-xs tracking-wider">Time</span>
                </label>
                <div className="relative">
                   <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Clock size={18} />
                  </div>
                  <input 
                    type="time" 
                    className="input input-bordered w-full pl-12 h-14 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl font-medium"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Special Requests */}
            <div className="form-control pt-4 border-t border-slate-100">
              <label className="label">
                <span className="label-text font-bold text-slate-700 flex items-center gap-2">
                  <Info size={16} className="text-orange-500" /> Special Requests (Optional)
                </span>
              </label>
              <textarea 
                className="textarea textarea-bordered h-32 bg-slate-50 border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 rounded-xl resize-none p-4 font-medium" 
                placeholder="Any allergies, dietary restrictions, or special occasions?"
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Submit Actions */}
            <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-end items-center">
              <button 
                type="button" 
                onClick={() => navigate('/seats')}
                className="px-8 py-3 rounded-xl text-slate-500 hover:text-slate-800 font-bold transition-all w-full sm:w-auto"
              >
                Back to Floor Plan
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-500/30 border-none w-full sm:w-auto h-14 px-12 text-lg hover:bg-orange-700 transition-all active:scale-95 disabled:bg-slate-300 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : 'Proceed to Checkout'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
