import { useState, useEffect, useMemo, useRef } from 'react';
import { Icon } from '../components/ui/Icon';
import api from '../services/api';
import type { Booking } from '../types';

const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
};

export default function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string>('');

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('All Dates');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/bookings');
        setBookings(res.data);
        setLoadError('');
      } catch (err: unknown) {
        console.error('Failed to load bookings', err);
        const error = err as { response?: { data?: { message?: string } } };
        setLoadError(error.response?.data?.message || 'Failed to load bookings. Please refresh the page.');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        booking.customerName?.toLowerCase().includes(searchLower) ||
        booking.id?.toString().includes(searchLower) ||
        booking.offerTitle?.toLowerCase().includes(searchLower);

      const matchesStatus = statusFilter === 'All Statuses' || booking.status === statusFilter;

      let matchesDate = true;
      if (dateFilter !== 'All Dates' && booking.slotDate) {
        const slotDate = new Date(booking.slotDate);
        const today = new Date();
        const diffTime = slotDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateFilter === 'Next 7 Days') {
          matchesDate = diffDays >= 0 && diffDays <= 7;
        } else if (dateFilter === 'This Month') {
          matchesDate = slotDate.getMonth() === today.getMonth() && slotDate.getFullYear() === today.getFullYear();
        } else if (dateFilter === 'Past 30 Days') {
          matchesDate = diffDays <= 0 && diffDays >= -30;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [bookings, searchQuery, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage, itemsPerPage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter]);

  const handleCancelBooking = async (id: number) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;
    try {
      await api.put(`/bookings/${id}/status`, 'Cancelled', {
        headers: { 'Content-Type': 'application/json' }
      });
      setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Cancelled' } : b));
      setActiveDropdown(null);
    } catch {
      alert('Failed to cancel booking');
    }
  };

  return (
    <div className="max-w-max-width w-full mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-2">
        <div>
          <h1 className="font-display-hero text-headline-xl uppercase tracking-tight text-on-background">
            Manage Bookings
          </h1>
          <p className="mt-2 font-body-md text-on-surface-variant font-bold uppercase tracking-widest">
            View, filter, and manage all customer reservations.
          </p>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 p-4 bg-surface rounded-lg neo-border neo-shadow">
        <div className="flex flex-1 w-full gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Icon name="search" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input 
              type="text"
              placeholder="Search by customer name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low neo-border rounded text-sm text-on-surface font-bold placeholder:text-outline focus:outline-none focus:neo-shadow transition-shadow"
            />
          </div>
          
          {/* Date Filter */}
          <div className="relative min-w-[160px] hidden sm:block">
            <Icon name="calendar_today" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
            <select 
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full appearance-none pl-10 pr-10 py-2.5 bg-surface-container-low neo-border rounded text-sm font-bold text-on-surface focus:outline-none focus:neo-shadow cursor-pointer"
            >
              <option value="All Dates">All Dates</option>
              <option value="Next 7 Days">Next 7 Days</option>
              <option value="This Month">This Month</option>
              <option value="Past 30 Days">Past 30 Days</option>
            </select>
            <Icon name="expand_more" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[140px] hidden sm:block">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-2.5 bg-surface-container-low neo-border rounded text-sm font-bold text-on-surface focus:outline-none focus:neo-shadow cursor-pointer"
            >
              <option value="All Statuses">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
              <option value="No Show">No Show</option>
            </select>
            <Icon name="expand_more" className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Bookings Custom List */}
      <div className="bg-surface rounded-lg neo-border neo-shadow overflow-visible">
        {/* List Header */}
        <div className="grid grid-cols-12 gap-4 px-8 py-4 border-b-[3px] border-on-surface bg-surface-container-low text-xs font-bold text-on-surface uppercase tracking-widest">
          <div className="col-span-2">Booking ID</div>
          <div className="col-span-3">Customer Name</div>
          <div className="col-span-3">Offer Title</div>
          <div className="col-span-2">Slot Time</div>
          <div className="col-span-1 text-center">Pax</div>
          <div className="col-span-1 text-center">Status</div>
        </div>

        {/* List Items */}
        <div className="divide-y-[3px] divide-on-surface" ref={dropdownRef}>
          {loading ? (
            <div className="p-12 text-center font-bold text-on-surface-variant">Loading reservations...</div>
          ) : loadError ? (
            <div className="p-12 text-center">
              <Icon name="error" size={48} className="text-on-surface-variant mx-auto mb-4" />
              <p className="font-body-md text-on-surface-variant font-bold uppercase tracking-widest">{loadError}</p>
            </div>
          ) : paginatedBookings.length === 0 ? (
            <div className="p-12 text-center font-bold text-on-surface-variant">
              {bookings.length === 0 ? "No bookings found in the system." : "No bookings match your current search and filters."}
            </div>
          ) : (
            paginatedBookings.map(booking => (
              <div key={booking.id} className="grid grid-cols-12 gap-4 items-center px-8 py-4 hover:bg-surface-variant transition-colors group relative">
                
                {/* ID Column */}
                <div className="col-span-2">
                  <span className="font-label-bold uppercase tracking-widest text-primary">
                    #BKG-{booking.id.toString().padStart(4, '0')}
                  </span>
                </div>

                {/* Customer Column */}
                <div className="col-span-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold text-on-primary shrink-0 bg-primary neo-border`}>
                    {getInitials(booking.customerName)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-headline-sm text-headline-sm font-bold text-on-surface truncate uppercase tracking-tight">
                      {booking.customerName}
                    </p>
                  </div>
                </div>

                {/* Offer Column */}
                <div className="col-span-3">
                  <p className="font-body-md text-on-surface font-bold truncate uppercase tracking-widest" title={booking.offerTitle}>
                    {booking.offerTitle || 'Unknown Offer'}
                  </p>
                </div>

                {/* Time Column */}
                <div className="col-span-2 flex flex-col">
                  <div className="font-label-bold text-on-surface flex items-center gap-1.5 uppercase tracking-widest">
                    {booking.slotDate ? new Date(booking.slotDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                  </div>
                  <div className="font-label-xs text-on-surface-variant flex items-center gap-1 mt-0.5 font-bold uppercase tracking-widest">
                    <Icon name="schedule" className="w-3 h-3" />
                    {booking.slotStartTime}
                  </div>
                </div>

                {/* Pax Column */}
                <div className="col-span-1 text-center">
                  <span className="font-display-hero text-headline-md text-on-surface">
                    {booking.numberOfPeople}
                  </span>
                </div>

                {/* Status Column */}
                <div className="col-span-1 flex justify-center items-center relative">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase tracking-widest font-black neo-border ${
                    booking.status === 'Confirmed' 
                      ? 'bg-secondary-container text-on-secondary-container'
                      : booking.status === 'Pending'
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-error text-on-error'
                  }`}>
                    {booking.status}
                  </div>
                  
                  {/* Actions Dots */}
                  <div className="absolute right-[-24px]">
                     <button 
                       onClick={() => setActiveDropdown(activeDropdown === booking.id ? null : booking.id)}
                       className="p-1.5 text-on-surface-variant hover:text-on-surface rounded bg-surface-container-low neo-border hover:neo-shadow transition-all cursor-pointer"
                     >
                       <Icon name="more_vert" className="w-4 h-4" />
                     </button>

                     {/* Dropdown Menu */}
                     {activeDropdown === booking.id && (
                        <div className="absolute right-6 top-8 w-44 bg-surface neo-border shadow-xl rounded overflow-hidden z-50 animate-in zoom-in-95 duration-100">
                          {booking.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancelBooking(booking.id)}
                              className="flex items-center gap-2 w-full px-4 py-2.5 text-sm font-bold bg-error text-on-error hover:bg-red-600 transition-colors text-left uppercase tracking-widest"
                            >
                              <Icon name="cancel" className="w-4 h-4" /> Cancel
                            </button>
                          )}
                        </div>
                     )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Pagination */}
        <div className="px-8 py-4 border-t-[3px] border-on-surface bg-surface-container-low flex items-center justify-between">
          <span className="text-[10px] font-bold text-on-surface uppercase tracking-widest">
             Showing {Math.min(filteredBookings.length, (currentPage - 1) * itemsPerPage + 1)} to {Math.min(filteredBookings.length, currentPage * itemsPerPage)} of {filteredBookings.length} entries
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded neo-border bg-surface text-on-surface hover:neo-shadow disabled:opacity-50 font-bold"
            >
              &lt;
            </button>
            
            {Array.from({ length: totalPages || 1 }).map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded neo-border font-bold ${
                  currentPage === i + 1 
                    ? 'bg-primary text-on-primary neo-shadow'
                    : 'bg-surface text-on-surface hover:neo-shadow'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="w-8 h-8 flex items-center justify-center rounded neo-border bg-surface text-on-surface hover:neo-shadow disabled:opacity-50 font-bold"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
