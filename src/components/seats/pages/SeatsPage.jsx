import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Info, Users, Clock, CalendarDays } from 'lucide-react';
import { useSeats } from '../../../hooks/useBooking';

const SeatsPage = () => {
  const [selectedSeat, setSelectedSeat] = useState(null);

  const { data: seatsData, isLoading, isError } = useSeats();
  const seats = Array.isArray(seatsData) ? seatsData : (seatsData?.results || []);

  const getSeatStatus = (seat) => {
    if (!seat.is_active) return 'reserved';
    return 'available';
  };

  const getSeatColor = (status, id) => {
    if (selectedSeat === id) return 'bg-orange-500 border-orange-600 text-white shadow-md shadow-orange-500/30 scale-105 z-10';
    switch (status) {
      case 'available': return 'bg-white border-emerald-200 text-slate-700 hover:border-orange-300 hover:shadow-sm';
      case 'reserved': return 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60';
      case 'pending': return 'bg-amber-50 border-amber-200 text-amber-700 cursor-wait';
      default: return 'bg-white border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <div className="w-2 h-2 rounded-full bg-emerald-400"></div>;
      case 'reserved': return <div className="w-2 h-2 rounded-full bg-slate-300"></div>;
      case 'pending': return <div className="w-2 h-2 rounded-full bg-amber-400"></div>;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">Interactive Floor Plan</h1>
          <p className="text-slate-500 max-w-2xl text-base md:text-lg">Select your preferred dining area and table for an unforgettable experience.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Legend and Info Sidebar */}
          <div className="lg:w-1/4 space-y-6 order-2 lg:order-1">

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-10"></div>
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Info size={18} className="text-orange-600" /> Availability
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-emerald-50/50 p-2 rounded-xl">
                  {getStatusIcon('available')}
                  <span className="text-sm font-medium text-slate-700">Available</span>
                </div>
                <div className="flex items-center gap-3 p-2">
                  {getStatusIcon('reserved')}
                  <span className="text-sm font-medium text-slate-500 uppercase font-black">Booked</span>
                </div>
                <div className="flex items-center gap-3 p-2">
                  {getStatusIcon('pending')}
                  <span className="text-sm font-medium text-slate-600">Pending Checkout</span>
                </div>
                <div className="flex items-center gap-3 bg-orange-50 p-2 rounded-xl border border-orange-100">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-sm font-bold text-orange-700">Selected</span>
                </div>
              </div>
            </div>

            {selectedSeat ? (
              <div className="bg-slate-900 rounded-3xl p-6 shadow-xl text-white transform transition-all animate-fade-in">
                <h3 className="font-bold text-xl mb-1 text-orange-400">Table {selectedSeat}</h3>
                <div className="flex flex-col gap-3 mt-4 mb-6">
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-orange-400">
                      <Users size={16} />
                    </div>
                    <span className="text-sm">Up to 4 Guests</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-orange-400">
                      <CalendarDays size={16} />
                    </div>
                    <span className="text-sm">Real-time availability</span>
                  </div>
                </div>

                <Link
                  to="/booking"
                  state={{ selectedSeat }}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl h-12 flex items-center justify-center shadow-lg shadow-orange-600/20 transition-all"
                >
                  Proceed to Book
                </Link>
                <button
                  onClick={() => setSelectedSeat(null)}
                  className="w-full mt-3 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  Cancel Selection
                </button>
              </div>
            ) : (
              <div className="bg-slate-100 rounded-3xl p-8 border border-slate-200 border-dashed text-center flex flex-col items-center justify-center text-slate-500 min-h-[220px]">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                  <span className="text-orange-400 font-bold block">?</span>
                </div>
                <p className="text-sm">Click on any table on the floor plan to begin your reservation.</p>
              </div>
            )}
          </div>

          {/* Interactive Floor Plan Area */}
          <div className="lg:w-3/4 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm min-h-[600px] flex flex-col">

              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Main Dining Hall</h2>
                <div className="px-4 py-1.5 bg-slate-100 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Entrance
                </div>
              </div>

              {/* Floor Plan container */}
              <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-100 p-6 relative flex flex-col items-center justify-center text-center">

                {seats.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 w-full max-w-3xl relative mx-auto">
                    {seats.map((seat) => {
                      const status = getSeatStatus(seat);
                      const isSelected = selectedSeat === seat.id;

                      return (
                        <button
                          key={seat.id}
                          disabled={status !== 'available'}
                          onClick={() => setSelectedSeat(seat.id)}
                          className={`relative flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300
                              ${getSeatColor(status, seat.id)}
                              aspect-square
                            `}
                        >
                          <span className="font-bold text-lg mb-1">{seat.seat_number}</span>
                          <div className="flex items-center justify-center gap-1 opacity-80">
                            <Users size={12} />
                            <span className="text-xs font-medium">{seat.capacity || 'Any'}</span>
                          </div>

                          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
                            {getStatusIcon(status)}
                            {status === 'reserved' && (
                              <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full uppercase">Booked</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium">Loading floor plan...</p>
                  </div>
                ) : (
                  <div className="text-slate-500 flex flex-col items-center justify-center">
                    <Clock size={40} className="mb-4 text-slate-300" />
                    <h3 className="font-bold text-lg text-slate-700">No Tables Available</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">There are currently no tables configured in the database or they are out of service.</p>
                  </div>
                )}

                <div className="mt-8 pt-4 w-full flex justify-center">
                  <div className="px-8 py-3 bg-slate-100 rounded-xl text-sm font-bold text-slate-400 uppercase tracking-widest border border-slate-200 border-dashed w-full max-w-xs text-center font-sans tracking-wide">
                    Open Kitchen Area
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SeatsPage;
